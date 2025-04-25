import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";


export async function POST(req: NextRequest,
    { params }: { params: { id: string, achievementId: string } }
) {
    try {
        const { id, achievementId } = params;
        const { userId } = getAuth(req);
        if (!userId) {

            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const supabase = await createClient();

        const { data: user, error: userError } = await supabase
            .from('users')
            .select()
            .eq('id', userId)
            .single();
        if (userError) {
            throw userError;
        }

        const { data, error } = await supabase
            .from('inventories')
            .insert({
                user_id: user.id,
                achievement_id: achievementId
            })

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}