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

        const supabase = await createClient();
        const { id } = await params;

        switch (id) {
            case 'recommendation': {
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select('id, plant_preference_embedding')
                    .eq('clerk_id', userId)
                    .single();

                if (userError || !user) {
                    console.error("User fetch error:", userError);
                    return new Response("User not found", { status: 404 });
                }

                if (!user.plant_preference_embedding) {
                    return new Response("User preference embedding not found", { status: 400 });
                }

                // Step 2: Call match_plants_by_preferences RPC function
                const { data: recommendedPlants, error: matchError } = await supabase
                    .rpc('match_plants_by_preferences', {
                        user_embedding: user.plant_preference_embedding,
                        user_id: user.id,
                        distance_threshold: 0.7,
                        max_results: 10,
                    });

                if (matchError) {
                    console.error("Match error:", matchError);
                    return new Response("Failed to get recommendations", { status: 500 });
                }

                return Response.json(recommendedPlants, { status: 200 });
            }

            default: {
                const { data, error } = await supabase
                    .from('plants')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    throw error;
                }
                return Response.json(data);
            }
        }
    } catch (e: any) {
        console.error("Unhandled error:", e);
        return Response.json({ error: e.message || e.toString() }, { status: 500 });
    }
}
