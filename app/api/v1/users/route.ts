import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";
import wkx from "wkx";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("Missing OpenAI API key", { status: 500 });
        }

        const body = await request.json();

        if (!body.hobbies || !Array.isArray(body.hobbies) || body.hobbies.length === 0) {
            return new NextResponse("Hobbies must be a non-empty array", { status: 400 });
        }

        if (
            !body.location ||
            body.location.type !== "Point" ||
            !Array.isArray(body.location.coordinates) ||
            body.location.coordinates.length !== 2
        ) {
            return new NextResponse("Invalid location format", { status: 400 });
        }

        const [longitude, latitude] = body.location.coordinates;
        const wktLocation = `POINT(${longitude} ${latitude})`;

        const supabase = await createClient();

        const hobbyText = body.hobbies.join(", ");
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: hobbyText,
            dimensions: 384,
        });

        const hobbyEmbedding = embeddingResponse.data[0].embedding;

        const userData = {
            clerk_id: userId,
            hobbies: body.hobbies,
            location: wktLocation,
            hobby_embedding: hobbyEmbedding,
            username: body.username,
            url: body.url,
        };

        const { error } = await supabase.from("users").insert(userData);

        if (error) {
            console.error("Error inserting user:", error);
            return new NextResponse(error.message, { status: 500 });
        }

        return new NextResponse("User created successfully", { status: 201 });
    } catch (error: any) {
        console.error("Server error:", error);
        return NextResponse.json(
            {
                error: error.message,
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const url = new URL(request.url);
        const radiant = url.searchParams.get('radiant');
        const supabase = await createClient();

        if (!radiant) {
            return new Response("Radiant value is required", { status: 400 });
        }

        const radiantValue = parseFloat(radiant);
        if (isNaN(radiantValue) || radiantValue <= 0) {
            return new Response("Invalid radiant value", { status: 400 });
        }

        // Fetch current user's coordinates
        const { data: currentUser, error: currentError } = await supabase
            .from('users')
            .select('id, clerk_id, location')
            .eq('clerk_id', userId)
            .single();

        if (currentError || !currentUser) {
            console.error(" REGISTER NOW FOR MORE! Error fetching current user:", currentError);
            return new Response("User not found", { status: 404 });
        }

        const wkbHexCurrent = currentUser.location as string;
        const geometryCurrent = wkx.Geometry.parse(Buffer.from(wkbHexCurrent, "hex"));
        const locationCurrent = geometryCurrent.toGeoJSON() as { type: string; coordinates: number[] };
        if (!locationCurrent || locationCurrent.type !== "Point" || !locationCurrent.coordinates) {
            return new NextResponse("Invalid user location", { status: 400 });
        }
        const [currentLon, currentLat] = locationCurrent.coordinates;

        // Call the RPC function to find users within radius
        const { data, error } = await supabase
            .rpc('find_users_within_radius', {
                lon: currentLon,
                lat: currentLat,
                radius_meters: radiantValue,
            });

        if (error) {
            console.error("Error fetching users:", JSON.stringify(error, null, 2));
            return new Response(error.message, { status: 500 });
        }

        // Parse the location field (WKB hex string) for each user
        const usersWithParsedLocation = data.map((user: { location: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }; }) => {
            const geometry = wkx.Geometry.parse(Buffer.from(user.location, "hex"));
            const geoJSON = geometry.toGeoJSON() as { type: string; coordinates: number[] };
            let longitude = 0;
            let latitude = 0;
            if (geoJSON && geoJSON.coordinates) {
                [longitude, latitude] = geoJSON.coordinates;
            }
            return {
                ...user,
                location: { longitude, latitude }, // Convert to a more usable format
            };
        });

        return NextResponse.json(usersWithParsedLocation, { status: 200 });

    } catch (e: any) {
        console.error("Server error:", e);
        return Response.json({
            error: e.message || e.toString(),
        }, {
            status: 500,
        });
    }
}
