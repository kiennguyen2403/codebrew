import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("achievements")
            .select("*")
        if (error) {
            console.error("Database error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
        return NextResponse.json(data);
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}