import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const supabase = await createClient();

        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_id", userId)
            .single();

        if (userError || !user) {
            console.error("User error:", userError);
            return new NextResponse("User not found", { status: 404 });
        }

        const { data: notifications, error: notificationsError } = await supabase
            .from("notifications")
            .select("id, user_id, content, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (notificationsError) {
            console.error("Notifications error:", notificationsError);
            return new NextResponse("Failed to fetch notifications", { status: 500 });
        }

        return NextResponse.json(notifications || [], { status: 200 });
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}