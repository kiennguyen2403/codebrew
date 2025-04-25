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

        const { data: conversations, error: convError } = await supabase
            .from("conversations")
            .select(`
                id,
                created_at,
                conversation_members (
                user_id,
                joined_at,
                users (
                    id,
                    clerk_id,
                    username
                )
                ),
                messages (
                id,
                content,
                created_at,
                user_id
                )
            `)
            .eq("conversation_members.user_id", user.id)
            .order("created_at", { ascending: false, referencedTable: "messages" });

        if (convError) {
            console.error("Conversation error:", convError);
            return new NextResponse("Failed to fetch conversations", { status: 500 });
        }

        const formattedConversations = conversations?.map((conv) => {
            const otherMembers = conv.conversation_members
                .filter((member) => member.user_id !== user.id)
                .map((member) => ({
                    user_id: member.user_id,
                    username: member.users[0].username || "Unknown",
                    joined_at: member.joined_at,
                }));

            const lastMessage = conv.messages?.length > 0 ? conv.messages[0] : null;

            return {
                id: conv.id,
                created_at: conv.created_at,
                other_members: otherMembers,
                last_message: lastMessage
                    ? {
                        id: lastMessage.id,
                        content: lastMessage.content,
                        created_at: lastMessage.created_at,
                        user_id: lastMessage.user_id,
                    }
                    : null,
            };
        }) || [];

        return NextResponse.json(formattedConversations, { status: 200 });
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { recipientId, content } = await request.json();
        if (!recipientId || !content || typeof content !== "string" || content.trim() === "") {
            return new NextResponse("Missing or invalid recipientId or content", { status: 400 });
        }

        const supabase = await createClient();

        // Fetch sender and recipient IDs from users table
        const { data: users, error: userError } = await supabase
            .from("users")
            .select("id, clerk_id")
            .in("clerk_id", [userId, recipientId]);

        if (userError || !users || users.length !== 2) {
            console.error("User error:", userError);
            return new NextResponse("Sender or recipient not found", { status: 404 });
        }

        const sender = users.find((u) => u.clerk_id === userId);
        const recipient = users.find((u) => u.clerk_id === recipientId);

        if (!sender || !recipient) {
            return new NextResponse("Sender or recipient not found", { status: 404 });
        }

        // Check for existing direct conversation between sender and recipient
        let conversationId: string | null = null;
        const { data: senderMemberships, error: senderError } = await supabase
            .from("conversation_members")
            .select("conversation_id")
            .eq("user_id", sender.id);

        if (senderError) {
            console.error("Error fetching sender memberships:", senderError);
            return new NextResponse("Failed to check sender conversations", { status: 500 });
        }

        const senderConversationIds = senderMemberships?.map((m) => m.conversation_id) || [];

        if (senderConversationIds.length > 0) {
            const { data: recipientMemberships, error: recipientError } = await supabase
                .from("conversation_members")
                .select("conversation_id")
                .eq("user_id", recipient.id)
                .in("conversation_id", senderConversationIds);

            if (recipientError) {
                console.error("Error fetching recipient memberships:", recipientError);
                return new NextResponse("Failed to check recipient conversations", { status: 500 });
            }

            for (const membership of recipientMemberships || []) {
                const { data: members, error: membersError } = await supabase
                    .from("conversation_members")
                    .select("user_id")
                    .eq("conversation_id", membership.conversation_id);

                if (membersError) {
                    console.error("Members error:", membersError);
                    continue;
                }

                if (
                    members.length === 2 &&
                    members.some((m) => m.user_id === sender.id) &&
                    members.some((m) => m.user_id === recipient.id)
                ) {
                    conversationId = membership.conversation_id;
                    break;
                }
            }
        }

        // Create new conversation if none exists
        if (!conversationId) {
            const { data: newConv, error: newConvError } = await supabase
                .from("conversations")
                .insert({})
                .select("id")
                .single();

            if (newConvError) {
                console.error("Error creating conversation:", newConvError);
                return new NextResponse("Failed to create conversation", { status: 500 });
            }

            conversationId = newConv.id;

            const { error: membersError } = await supabase
                .from("conversation_members")
                .insert([
                    { conversation_id: conversationId, user_id: sender.id },
                    { conversation_id: conversationId, user_id: recipient.id },
                ]);

            if (membersError) {
                console.error("Error adding members:", membersError);
                return new NextResponse("Failed to add members", { status: 500 });
            }
        }

        // Insert the message
        const { data: message, error: messageError } = await supabase
            .from("messages")
            .insert({
                conversation_id: conversationId,
                user_id: sender.id,
                content: content.trim(),
            })
            .select()
            .single();

        if (messageError) {
            console.error("Error sending message:", messageError);
            return new NextResponse("Failed to send message", { status: 500 });
        }

        return NextResponse.json(
            {
                message,
                conversationId,
            },
            { status: 201 }
        );
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}