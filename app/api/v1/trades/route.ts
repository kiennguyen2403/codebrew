import { NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }
        const supabase = await createClient();

        // Fetch the user's ID from the users table
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single();

        if (userError) throw userError;

        // Fetch trades involving the user as initiator or receiver
        const { data, error } = await supabase
            .from('trades')
            .select(`
                *,
                initiator:initiator_id (id, name, clerk_id),
                receiver:receiver_id (id, name, clerk_id),
                initiator_plant:initiator_plant_id (id, name, type),
                receiver_plant:receiver_plant_id (id, name, type)
            `)
            .or(`initiator_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        return Response.json(data, { status: 200 });
    } catch (e: any) {
        return Response.json({
            error: e.message || 'Failed to fetch trades',
        }, {
            status: 500,
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, getToken } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const supabase = await createClient();
        const { initiator_plant_id, receiver_id, receiver_plant_id } = await request.json();

        // Fetch the initiator's user ID from the users table
        const { data: initiatorUser, error: initiatorUserError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single();

        if (initiatorUserError || !initiatorUser) {
            return Response.json({
                error: 'Initiator user not found',
            }, {
                status: 404,
            });
        }

        // Fetch the initiator's garden
        const { data: initiatorGarden, error: initiatorGardenError } = await supabase
            .from('gardens')
            .select('id')
            .eq('user_id', initiatorUser.id)
            .single();

        if (initiatorGardenError || !initiatorGarden) {
            return Response.json({
                error: 'Initiator garden not found',
            }, {
                status: 404,
            });
        }

        // Validate that the initiator_plant_id exists in the initiator's garden with sufficient quantity
        const { data: initiatorgrowing, error: initiatorgrowingError } = await supabase
            .from('growing')
            .select('id, quantity')
            .eq('garden_id', initiatorGarden.id)
            .eq('plant_id', initiator_plant_id)
            .single();

        if (initiatorgrowingError || !initiatorgrowing || initiatorgrowing.quantity < 1) {
            return Response.json({
                error: 'Initiator plant not found in garden or insufficient quantity',
            }, {
                status: 403,
            });
        }

        // Fetch the receiver's garden
        const { data: receiverGarden, error: receiverGardenError } = await supabase
            .from('gardens')
            .select('id')
            .eq('user_id', receiver_id)
            .single();

        if (receiverGardenError || !receiverGarden) {
            return Response.json({
                error: 'Receiver garden not found',
            }, {
                status: 404,
            });
        }

        // Validate that the receiver_plant_id exists in the receiver's garden with sufficient quantity
        const { data: receivergrowing, error: receivergrowingError } = await supabase
            .from('growing')
            .select('id, quantity')
            .eq('garden_id', receiverGarden.id)
            .eq('plant_id', receiver_plant_id)
            .single();

        if (receivergrowingError || !receivergrowing || receivergrowing.quantity < 1) {
            return Response.json({
                error: 'Receiver plant not found in garden or insufficient quantity',
            }, {
                status: 403,
            });
        }

        // Create the trade
        const { data, error } = await supabase
            .from('trades')
            .insert({
                initiator_id: initiatorUser.id,
                receiver_id,
                initiator_plant_id,
                receiver_plant_id,
                status: 'pending',
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return Response.json(data, { status: 201 });
    } catch (e: any) {
        return Response.json({
            error: e.message || 'Failed to create trade',
        }, {
            status: 500,
        });
    }
}