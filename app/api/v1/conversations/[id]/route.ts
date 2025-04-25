import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';


export async function GET(request: NextRequest) {
    try {

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();

        const { data: conversations, error } = await supabase
            .from('conversations')
            .select(`
        id,
        created_at,
        conversation_members (
          user_id,
          joined_at
        )
      `)
            .eq('conversation_members.user_id', userId);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
        }

        // Return the conversations
        return NextResponse.json({
            conversations: conversations || [],
            message: 'Conversations fetched successfully',
        }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}