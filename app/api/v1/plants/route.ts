import { NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const { userId, getToken } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('plants')
            .select('*');
        if (error) {
            throw error;
        }
    } catch (e) {
        return Response.json({
            error: e,
        }, {
            status: 500,
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }
        const body = await request.json()
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('plants')
            .insert(body);
        if (error) {
            throw error;
        }

        return new Response('OK', { status: 204 });
    } catch (e) {
        return Response.json({
            error: e,
        }, {
            status: 500,
        });

    }
}