import { NextRequest, } from "next/server";
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; plantId: string }> }
) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const supabase = await createClient();

        const { id, plantId } = await params;
        const { quantity } = await request.json();

        const { error } = await supabase
            .from('growing')
            .insert({
                garden_id: id,
                plant_id: plantId,
                quantity: quantity
            })

        if (error)
            throw error;
        return new Response('OK', { status: 204 });

    } catch (e: any) {
        return Response.json({
            error: e,
        }, {
            status: 500,
        });
    }
}