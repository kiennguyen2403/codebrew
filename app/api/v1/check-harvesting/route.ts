import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.rpc('check_all_harvest_ready');

        if (error) {
            return new NextResponse(
                JSON.stringify({ error: error.message || 'Failed to check harvest-ready plants' }),
                { status: 500 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: 'Harvest check completed successfully' }),
            { status: 200 }
        );
    } catch (e: any) {
        return new NextResponse(
            JSON.stringify({ error: e.message || 'Unexpected error' }),
            { status: 500 }
        );
    }
}