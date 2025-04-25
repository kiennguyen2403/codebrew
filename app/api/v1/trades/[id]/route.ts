import { NextRequest, NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

export async function PUT(
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
        const { status } = await request.json();

        // Validate status
        const validStatuses = ['accepted', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return Response.json({
                error: 'Invalid status',
            }, {
                status: 400,
            });
        }

        // Fetch the trade with related plant and garden data
        const { data: trade, error: tradeError } = await supabase
            .from('trades')
            .select(`
                *,
                initiator_plant:initiator_plant_id (id, garden_id),
                receiver_plant:receiver_plant_id (id, garden_id)
            `)
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

        // If trade is accepted, adjust the growing table quantities
        if (status === 'accepted') {
            // Fetch growing entries for the initiator's plant in the initiator's garden
            const { data: initiatorgrowing, error: initiatorgrowingError } = await supabase
                .from('growing')
                .select('id, quantity')
                .eq('garden_id', trade.initiator_plant.garden_id)
                .eq('plant_id', trade.initiator_plant_id)
                .single();

            if (initiatorgrowingError || !initiatorgrowing) {
                throw new Error('Initiator plant not found in growing table');
            }

            // Fetch growing entries for the receiver's plant in the receiver's garden
            const { data: receivergrowing, error: receivergrowingError } = await supabase
                .from('growing')
                .select('id, quantity')
                .eq('garden_id', trade.receiver_plant.garden_id)
                .eq('plant_id', trade.receiver_plant_id)
                .single();

            if (receivergrowingError || !receivergrowing) {
                throw new Error('Receiver plant not found in growing table');
            }

            // Reduce quantities in the original gardens (assuming quantity of 1 per trade)
            const initiatorNewQuantity = initiatorgrowing.quantity - 1;
            const receiverNewQuantity = receivergrowing.quantity - 1;

            // Update or delete initiator's growing entry
            if (initiatorNewQuantity <= 0) {
                const { error: deleteError1 } = await supabase
                    .from('growing')
                    .delete()
                    .eq('id', initiatorgrowing.id);
                if (deleteError1) throw new Error('Failed to remove initiator plant from growing table');
            } else {
                const { error: updateError1 } = await supabase
                    .from('growing')
                    .update({ quantity: initiatorNewQuantity })
                    .eq('id', initiatorgrowing.id);
                if (updateError1) throw new Error('Failed to update initiator plant quantity');
            }

            // Update or delete receiver's growing entry
            if (receiverNewQuantity <= 0) {
                const { error: deleteError2 } = await supabase
                    .from('growing')
                    .delete()
                    .eq('id', receivergrowing.id);
                if (deleteError2) throw new Error('Failed to remove receiver plant from growing table');
            } else {
                const { error: updateError2 } = await supabase
                    .from('growing')
                    .update({ quantity: receiverNewQuantity })
                    .eq('id', receivergrowing.id);
                if (updateError2) throw new Error('Failed to update receiver plant quantity');
            }

            // Add plants to the new gardens in the growing table
            // Check if initiator's plant already exists in receiver's garden
            const { data: receiverGardengrowing, error: receiverGardengrowingError } = await supabase
                .from('growing')
                .select('id, quantity')
                .eq('garden_id', trade.receiver_plant.garden_id)
                .eq('plant_id', trade.initiator_plant_id)
                .single();

            if (receiverGardengrowingError && receiverGardengrowingError.code !== 'PGRST116') {
                throw receiverGardengrowingError;
            }

            if (receiverGardengrowing) {
                // Update quantity if exists
                const { error: updateError3 } = await supabase
                    .from('growing')
                    .update({ quantity: receiverGardengrowing.quantity + 1 })
                    .eq('id', receiverGardengrowing.id);
                if (updateError3) throw new Error('Failed to update receiver garden quantity');
            } else {
                // Insert new entry if it doesn't exist
                const { error: insertError1 } = await supabase
                    .from('growing')
                    .insert({
                        garden_id: trade.receiver_plant.garden_id,
                        plant_id: trade.initiator_plant_id,
                        quantity: 1,
                    });
                if (insertError1) throw new Error('Failed to add initiator plant to receiver garden');
            }

            // Check if receiver's plant already exists in initiator's garden
            const { data: initiatorGardengrowing, error: initiatorGardengrowingError } = await supabase
                .from('growing')
                .select('id, quantity')
                .eq('garden_id', trade.initiator_plant.garden_id)
                .eq('plant_id', trade.receiver_plant_id)
                .single();

            if (initiatorGardengrowingError && initiatorGardengrowingError.code !== 'PGRST116') {
                throw initiatorGardengrowingError;
            }

            if (initiatorGardengrowing) {
                // Update quantity if exists
                const { error: updateError4 } = await supabase
                    .from('growing')
                    .update({ quantity: initiatorGardengrowing.quantity + 1 })
                    .eq('id', initiatorGardengrowing.id);
                if (updateError4) throw new Error('Failed to update initiator garden quantity');
            } else {
                // Insert new entry if it doesn't exist
                const { error: insertError2 } = await supabase
                    .from('growing')
                    .insert({
                        garden_id: trade.initiator_plant.garden_id,
                        plant_id: trade.receiver_plant_id,
                        quantity: 1,
                    });
                if (insertError2) throw new Error('Failed to add receiver plant to initiator garden');
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