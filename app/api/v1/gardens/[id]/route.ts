import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const supabase = await createClient();

        switch (id) {
            case "me": {
                // Fetch user ID from users table
                const { data: user, error: userError } = await supabase
                    .from("users")
                    .select("id")
                    .eq("clerk_id", userId)
                    .single();

                if (userError || !user) {
                    console.error("User error:", userError);
                    return new NextResponse("User not found", { status: 404 });
                }

                // Fetch the user's garden
                const { data: garden, error: gardenError } = await supabase
                    .from("gardens")
                    .select("id, created_at, user_id")
                    .eq("user_id", user.id)
                    .single();

                if (gardenError || !garden) {
                    console.error("Garden error:", gardenError);
                    return new NextResponse("Garden not found for this user", { status: 404 });
                }

                // Fetch plants associated with the garden
                const { data: growingPlants, error: growingError } = await supabase
                    .from("growing")
                    .select(`
                        garden_id,
                        plant_id,
                        quantity,
                        plants (
                        id,
                        created_at,
                        name,
                        url
                        )
                    `)
                    .eq("garden_id", garden.id);

                if (growingError) {
                    console.error("Growing error:", growingError);
                    return new NextResponse("Failed to fetch plants", { status: 500 });
                }

                // Format the plants response
                const plants = growingPlants?.map((growing) => ({
                    plant_id: growing.plant_id,
                    quantity: growing.quantity,
                    ...growing.plants,
                })) || [];

                return NextResponse.json(
                    {
                        garden,
                        plants,
                    },
                    { status: 200 }
                );
            }

            case "recommendation": {
                // Not implemented
                return new NextResponse("Not Implemented", { status: 501 });
            }

            default: {
                // Fetch the garden by ID (no ownership check)
                const { data: garden, error: gardenError } = await supabase
                    .from("gardens")
                    .select("id, created_at, user_id")
                    .eq("id", id)
                    .single();

                if (gardenError || !garden) {
                    console.error("Garden error:", gardenError);
                    return new NextResponse("Garden not found", { status: 404 });
                }

                // Fetch plants associated with the garden
                const { data: growingPlants, error: growingError } = await supabase
                    .from("growing")
                    .select(`
                        garden_id,
                        plant_id,
                        quantity,
                        plants (
                        id,
                        created_at,
                        name,
                        url
                        )
                    `)
                    .eq("garden_id", id);

                if (growingError) {
                    console.error("Growing error:", growingError);
                    return new NextResponse("Failed to fetch plants", { status: 500 });
                }

                // Format the plants response
                const plants = growingPlants?.map((growing) => ({
                    plant_id: growing.plant_id,
                    quantity: growing.quantity,
                    ...growing.plants,
                })) || [];

                return NextResponse.json(
                    {
                        garden,
                        plants,
                    },
                    { status: 200 }
                );
            }
        }
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}