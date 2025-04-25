import { NextRequest, NextResponse, } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const supabase = await createClient();

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

        // Insert new garden with user.id
        const { data: garden, error: gardenError } = await supabase
            .from("gardens")
            .insert({
                user_id: user.id,
            })
            .select()
            .single();

        if (gardenError) {
            console.error("Garden insert error:", gardenError);
            throw gardenError;
        }

        return NextResponse.json({ message: "Garden created successfully", garden }, { status: 201 });
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('gardens')
            .select('*');
        if (error)
            throw error;
        return Response.json(data);
    } catch (e: any) {
        return Response.json({
            error: e,
        }, {
            status: 500,
        });
    }
}