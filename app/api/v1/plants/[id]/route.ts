import { NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

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

        if (id === 'recommendation') {
            // Fetch current user's data
            const { data: currentUser, error: userError } = await supabase
                .from('users')
                .select('id, clerk_id, location')
                .eq('clerk_id', userId)
                .single();

            if (userError || !currentUser) {
                console.error("Error fetching current user:", JSON.stringify(userError, null, 2));
                return new Response("User not found", { status: 404 });
            }

            // Determine season (Northern Hemisphere)
            const currentSeason = (new Date().getMonth() >= 2 && new Date().getMonth() <= 7) ? 'Warm' : 'Cool';

            // Set user location (default to neutral)
            const userLocation = 'Indoor/Outdoor'; // Adjust if location_preference column exists

            // Fetch plant recommendations
            const { data: recommendedPlants, error: matchError } = await supabase
                .rpc('match_plants_by_preferences', {
                    user_id: currentUser.id,
                    user_location: userLocation,
                    current_season: currentSeason,
                    max_results: 10,
                });

            if (matchError) {
                console.error("Match error:", JSON.stringify(matchError, null, 2));
                return new Response("Failed to get recommendations", { status: 500 });
            }

            return Response.json({
                recommendedPlants: recommendedPlants || [],
            });
        }

        // Default case: Fetch a single plant by ID
        const { data, error } = await supabase
            .from('plants')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching plant:", JSON.stringify(error, null, 2));
            return new Response(error.message, { status: 500 });
        }

        return Response.json(data);

    } catch (e: any) {
        console.error("Server error:", e);
        return Response.json({
            error: e.message || e.toString(),
        }, {
            status: 500,
        });
    }
}