import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";
import wkx from "wkx";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const supabase = await createClient();

        switch (id) {
            case 'me': {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('clerk_id', userId)
                    .single();
                if (error) {
                    return new Response(error.message, { status: 500 });
                }
                return Response.json(data);
            }
            case 'recommendation': {
                const { data: currentUser, error: userError } = await supabase
                    .from("users")
                    .select("id, hobby_embedding, location")
                    .eq("clerk_id", userId)
                    .single();

                if (userError || !currentUser) {
                    console.error("User error:", userError);
                    return new NextResponse("User not found", { status: 404 });
                }

                if (!currentUser.hobby_embedding || !currentUser.location) {
                    return new NextResponse("User missing hobbies or location", { status: 400 });
                }

                // Parse WKB hex string to GeoJSON using wkx
                const wkbHexCurrent = currentUser.location as string;
                const geometryCurrent = wkx.Geometry.parse(Buffer.from(wkbHexCurrent, "hex"));
                const locationCurrent = geometryCurrent.toGeoJSON() as { type: string; coordinates: number[] };
                if (!locationCurrent || locationCurrent.type !== "Point" || !locationCurrent.coordinates) {
                    return new NextResponse("Invalid user location", { status: 400 });
                }
                const [currentLon, currentLat] = locationCurrent.coordinates;

                // Use raw SQL for vector search with pgvector
                const { data: similarUsers, error: searchError } = await supabase
                    .rpc("match_users_by_hobbies", {
                        user_embedding: currentUser.hobby_embedding,
                        user_id: currentUser.id,
                        distance_threshold: 0.7,
                        max_results: 10,
                    });

                if (searchError) {
                    console.error("Search error:", searchError);
                    return new NextResponse("Failed to search users", { status: 500 });
                }

                if (!similarUsers || similarUsers.length === 0) {
                    return NextResponse.json([], { status: 200 });
                }

                const userIds = similarUsers.map((u: any) => u.id);
                const { data: recommendedUsers, error: fetchError } = await supabase
                    .from("users")
                    .select("id, clerk_id, hobbies, location")
                    .in("id", userIds);

                if (fetchError) {
                    console.error("Fetch error:", fetchError);
                    return new NextResponse("Failed to fetch recommended users", { status: 500 });
                }

                // Calculate distances and sort
                const recommendations = recommendedUsers.map((user: any) => {
                    const wkbHex = user.location as string;
                    const geometry = wkx.Geometry.parse(Buffer.from(wkbHex, "hex"));
                    const userLocation = geometry.toGeoJSON() as { type: string; coordinates: number[] };
                    const [lon, lat] = userLocation.coordinates || [0, 0];

                    // Calculate distance using ST_Distance (in meters)
                    const distanceQuery = supabase
                        .rpc("calculate_distance", {
                            lat1: currentLat,
                            lon1: currentLon,
                            lat2: lat,
                            lon2: lon,
                        });

                    return {
                        id: user.id,
                        clerk_id: user.clerk_id,
                        hobbies: user.hobbies,
                        distance: distanceQuery,
                    };
                });

                const finalRecommendations = await Promise.all(
                    recommendations.map(async (rec: any) => {
                        const { data: distance } = await rec.distance;
                        return {
                            ...rec,
                            distance: distance || Number.MAX_VALUE,
                        };
                    })
                );

                // Sort by distance (since similarUsers is already sorted by hobby similarity)
                finalRecommendations.sort((a, b) => a.distance - b.distance);

                // Limit to top 5 recommendations
                const topRecommendations = finalRecommendations.slice(0, 5);

                return NextResponse.json(topRecommendations, { status: 200 });
            }
            default: {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    return new Response(error.message, { status: 500 });
                }
                return Response.json(data);
            }
        }
    } catch (e: any) {
        return Response.json({
            error: e,
        }, {
            status: 500,
        });
    }
}