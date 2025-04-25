import { NextRequest, NextResponse, } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(
    request: NextRequest
) {
    try {
        const { userId, getToken } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const body = await request.json();

        const supabase = await createClient();
        const { error } = await supabase
            .from('users')
            .insert(body)

        if (error) {
            return new NextResponse(error.message, { status: 500 });
        }

        return new NextResponse('OK', { status: 204 });

    } catch (error) {
        return Response.json({
            error: error,
        }, {
            status: 500,
        });
    }
}