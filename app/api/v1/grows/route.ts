import { NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, getToken } = await auth();
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

        const { plant_id, quantity = 1 } = await request.json();

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return Response.json({
                error: 'Quantity must be a positive integer',
            }, {
                status: 400,
            });
        }


        // Fetch the user's garden
        const { data: garden, error: gardenError } = await supabase
            .from('gardens')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (gardenError || !garden) {
            return Response.json({
                error: 'Garden not found for user',
            }, {
                status: 404,
            });
        }

        // Validate that the plant exists
        const { data: plant, error: plantError } = await supabase
            .from('plants')
            .select('id')
            .eq('id', plant_id)
            .single();

        if (plantError || !plant) {
            return Response.json({
                error: 'Plant not found',
            }, {
                status: 404,
            });
        }

        // Check if the plant already exists in the garden
        const { data: existingGrow, error: growError } = await supabase
            .from('grow')
            .select('id, quantity')
            .eq('garden_id', garden.id)
            .eq('plant_id', plant_id)
            .single();

        if (growError && growError.code !== 'PGRST116') { // PGRST116 means "no rows found"
            throw growError;
        }

        let updatedGrow;
        if (existingGrow) {
            // If the plant exists, update the quantity
            const newQuantity = existingGrow.quantity + quantity;
            const { data, error: updateError } = await supabase
                .from('grow')
                .update({ quantity: newQuantity })
                .eq('id', existingGrow.id)
                .select()
                .single();

            if (updateError) throw updateError;
            updatedGrow = data;
        } else {
            // If the plant doesn't exist, insert a new row
            const { data, error: insertError } = await supabase
                .from('grow')
                .insert({
                    garden_id: garden.id,
                    plant_id,
                    quantity,
                })
                .select()
                .single();

            if (insertError) throw insertError;
            updatedGrow = data;
        }

        return Response.json(updatedGrow, { status: 201 });
    } catch (e: any) {
        return Response.json({
            error: e.message || 'Failed to add plant to garden',
        }, {
            status: 500,
        });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId, getToken } = await auth();
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

        const { plant_id, quantity = 1 } = await request.json();

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity <= 0) {
            return Response.json({
                error: 'Quantity must be a positive integer',
            }, {
                status: 400,
            });
        }

        // Fetch the user's garden
        const { data: garden, error: gardenError } = await supabase
            .from('gardens')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (gardenError || !garden) {
            return Response.json({
                error: 'Garden not found for user',
            }, {
                status: 404,
            });
        }

        // Check if the plant exists in the garden
        const { data: existingGrow, error: growError } = await supabase
            .from('grow')
            .select('id, quantity')
            .eq('garden_id', garden.id)
            .eq('plant_id', plant_id)
            .single();

        if (growError || !existingGrow) {
            return Response.json({
                error: 'Plant not found in garden',
            }, {
                status: 404,
            });
        }

        // Update or delete based on remaining quantity
        const newQuantity = existingGrow.quantity - quantity;
        if (newQuantity <= 0) {
            // If quantity becomes 0 or less, delete the row
            const { error: deleteError } = await supabase
                .from('grow')
                .delete()
                .eq('id', existingGrow.id);

            if (deleteError) throw deleteError;
        } else {
            // Otherwise, update the quantity
            const { error: updateError } = await supabase
                .from('grow')
                .update({ quantity: newQuantity })
                .eq('id', existingGrow.id);

            if (updateError) throw updateError;
        }

        return new Response(null, { status: 204 });
    } catch (e: any) {
        return Response.json({
            error: e.message || 'Failed to remove plant from garden',
        }, {
            status: 500,
        });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { userId, getToken } = await auth();
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

        const { plant_id, quantity } = await request.json();

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity < 0) {
            return Response.json({
                error: 'Quantity must be a non-negative integer',
            }, {
                status: 400,
            });
        }

        // Fetch the user's garden
        const { data: garden, error: gardenError } = await supabase
            .from('gardens')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (gardenError || !garden) {
            return Response.json({
                error: 'Garden not found for user',
            }, {
                status: 404,
            });
        }

        // Check if the plant exists in the garden
        const { data: existingGrow, error: growError } = await supabase
            .from('grow')
            .select('id, quantity')
            .eq('garden_id', garden.id)
            .eq('plant_id', plant_id)
            .single();

        if (growError || !existingGrow) {
            return Response.json({
                error: 'Plant not found in garden',
            }, {
                status: 404,
            });
        }

        // Update or delete based on new quantity
        if (quantity === 0) {
            // If quantity is set to 0, delete the row
            const { error: deleteError } = await supabase
                .from('grow')
                .delete()
                .eq('id', existingGrow.id);

            if (deleteError) throw deleteError;

            return new Response(null, { status: 204 });
        } else {
            // Otherwise, update the quantity
            const { data: updatedGrow, error: updateError } = await supabase
                .from('grow')
                .update({ quantity })
                .eq('id', existingGrow.id)
                .select()
                .single();

            if (updateError) throw updateError;

            return Response.json(updatedGrow, { status: 200 });
        }
    } catch (e: any) {
        return Response.json({
            error: e.message || 'Failed to update plant quantity',
        }, {
            status: 500,
        });
    }
}