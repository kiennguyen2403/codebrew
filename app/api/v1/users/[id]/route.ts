import { NextRequest, } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId, getToken } = await auth();
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

