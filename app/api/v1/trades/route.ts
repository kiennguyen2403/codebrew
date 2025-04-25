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

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_id', userId)
            .single();

        if (userError) throw userError;

        const { data, error } = await supabase
            .from('trades')
            .select(`
                *,
                initiator:initiator_id (id, name),
                receiver:receiver_id (id, name),
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

        // Validate plant ownership (initiator_plant_id belongs to the initiator)
        const { data: initiatorPlant, error: initiatorError } = await supabase
            .from('plants')
            .select('owner_id')
            .eq('id', initiator_plant_id)
            .single();

        if (initiatorError || !initiatorPlant || initiatorPlant.owner_id !== userId) {
            return Response.json({
                error: 'Invalid plant or not owned by user',
            }, {
                status: 403,
            });
        }

        // Validate receiver_plant_id belongs to the receiver
        const { data: receiverPlant, error: receiverError } = await supabase
            .from('plants')
            .select('owner_id')
            .eq('id', receiver_plant_id)
            .single();

        if (receiverError || !receiverPlant || receiverPlant.owner_id !== receiver_id) {
            return Response.json({
                error: 'Invalid receiver plant or not owned by receiver',
            }, {
                status: 403,
            });
        }

        // Create the trade
        const { data, error } = await supabase
            .from('trades')
            .insert({
                initiator_id: userId,
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

export async function PUT(request: NextRequest) {
    try {
        const { userId, getToken } = await auth();
        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const supabase = await createClient();
        const { id, status } = await request.json();

        // Validate status
        const validStatuses = ['accepted', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return Response.json({
                error: 'Invalid status',
            }, {
                status: 400,
            });
        }

        // Fetch the trade
        const { data: trade, error: tradeError } = await supabase
            .from('trades')
            .select('*')
            .eq('id', id)
            .single();

        if (tradeError || !trade) {
            return Response.json({
                error: 'Trade not found',
            }, {
                status: 404,
            });
        }

        // Only the receiver can update the status initially (to accept/reject)
        if (trade.status === 'pending' && userId !== trade.receiver_id) {
            return Response.json({
                error: 'Only the receiver can update this trade',
            }, {
                status: 403,
            });
        }

        // Update trade status
        const { data: updatedTrade, error: updateError } = await supabase
            .from('trades')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            throw updateError;
        }

        // If trade is accepted, swap the plant ownership
        if (status === 'accepted') {
            const { error: plantUpdateError1 } = await supabase
                .from('plants')
                .update({ owner_id: trade.receiver_id, garden_id: trade.receiver_id })
                .eq('id', trade.initiator_plant_id);

            const { error: plantUpdateError2 } = await supabase
                .from('plants')
                .update({ owner_id: trade.initiator_id, garden_id: trade.initiator_id })
                .eq('id', trade.receiver_plant_id);

            if (plantUpdateError1 || plantUpdateError2) {
                throw new Error('Failed to swap plants');
            }

            // Mark trade as completed
            const { error: completeError } = await supabase
                .from('trades')
                .update({ status: 'completed', updated_at: new Date().toISOString() })
                .eq('id', id);

            if (completeError) {
                throw completeError;
            }
        }

        return Response.json(updatedTrade, { status: 200 });
    } catch (e: any) {
        return Response.json({
            error: e.message || 'Failed to update trade',
        }, {
            status: 500,
        });
    }
}