import { NextRequest, } from "next/server";
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
                return new Response('Not Implemented', { status: 501 });
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
        return Response.json({
            error: e,
        }, {
            status: 500,
        });
    }
}