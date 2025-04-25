import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id: conversationId } = params;
        if (!conversationId) {
            return new NextResponse("Missing conversation ID", { status: 400 });
        }

        const { userId: newMemberId } = await request.json();
        if (!newMemberId) {
            return new NextResponse("Missing userId in request body", { status: 400 });
        }

        if (newMemberId === userId) {
            return new NextResponse("Cannot add yourself to the conversation", { status: 400 });
        }

        const supabase = await createClient();

        // Verify the requesting user is a member of the conversation
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

        // Verify the conversation exists and check its type
        const { data: conversation, error: conversationError } = await supabase
            .from("conversations")
            .select("id, type")
            .eq("id", conversationId)
            .single();

        if (conversationError || !conversation) {
            console.error("Conversation error:", conversationError);
            return new NextResponse("Conversation not found", { status: 404 });
        }

        // Optional: Prevent adding members to direct conversations
        if (conversation.type === "direct") {
            return new NextResponse("Cannot add members to a direct conversation", { status: 400 });
        }

        // Check if the new member is already in the conversation
        const { data: existingMember, error: existingMemberError } = await supabase
            .from("conversation_members")
            .select("user_id")
            .eq("conversation_id", conversationId)
            .eq("user_id", newMemberId)
            .single();

        if (existingMember) {
            return new NextResponse("User is already a member of this conversation", { status: 400 });
        }
        if (existingMemberError && existingMemberError.code !== "PGRST116") {
            // PGRST116: No rows found, which is expected if user isn't a member
            console.error("Existing member check error:", existingMemberError);
            return new NextResponse("Failed to check existing membership", { status: 500 });
        }

        // Add the new member
        const { data: newMembership, error: insertError } = await supabase
            .from("conversation_members")
            .insert({
                conversation_id: conversationId,
                user_id: newMemberId,
            })
            .select()
            .single();

        if (insertError) {
            console.error("Error adding member:", insertError);
            return new NextResponse("Failed to add member", { status: 500 });
        }

        return NextResponse.json({
            membership: newMembership,
            message: "Member added successfully",
        }, { status: 201 });
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}