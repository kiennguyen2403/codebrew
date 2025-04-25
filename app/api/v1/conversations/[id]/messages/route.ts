import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id: conversationId } = await params;
        if (!conversationId) {
            return new NextResponse("Missing conversation ID", { status: 400 });
        }

        const { content } = await request.json();
        if (!content || typeof content !== "string" || content.trim() === "") {
            return new NextResponse("Missing or invalid message content", { status: 400 });
        }

        const supabase = await createClient();

        // Verify the user is a member of the conversation
        const { data: membership, error: membershipError } = await supabase
            .from("conversation_members")
            .select("user_id")
            .eq("conversation_id", conversationId)
            .eq("user_id", userId)
            .single();

        if (membershipError || !membership) {
            console.error("Membership error:", membershipError);
            return new NextResponse("Not a member of this conversation", { status: 403 });
        }

        // Verify the conversation exists
        const { data: conversation, error: conversationError } = await supabase
            .from("conversations")
            .select("id")
            .eq("id", conversationId)
            .single();

        if (conversationError || !conversation) {
            console.error("Conversation error:", conversationError);
            return new NextResponse("Conversation not found", { status: 404 });
        }


        const { data: message, error: messageError } = await supabase
            .from("messages")
            .insert({
                conversation_id: conversationId,
                user_id: userId,
                content: content.trim(),
            })
            .select()
            .single();

        if (messageError) {
            console.error("Error adding message:", messageError);
            return new NextResponse("Failed to add message", { status: 500 });
        }

        return new NextResponse('OK', { status: 204 });
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}