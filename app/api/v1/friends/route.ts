// app/api/friends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

interface FriendResponse {
    id: number;
    clerk_id: string;
    preferred_plant_type?: string;
}

interface FriendsApiResponse {
    friends: FriendResponse[];
    pending: FriendResponse[];
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const supabase = await createClient();
        const { data: currentUser, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_id", userId)
            .single();

        if (userError || !currentUser) {
            console.error("Error fetching user:", JSON.stringify(userError, null, 2));
            return new Response("User not found", { status: 404 });
        }

        const { data: friends, error: friendsError } = await supabase
            .from("friends")
            .select(`
                user_id,
                friend_id,
                status,
                users!friends_friend_id_fkey (clerk_id, preferred_plant_type)
            `)
            .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`);

        if (friendsError) {
            console.error("Error fetching friends:", JSON.stringify(friendsError, null, 2));
            return new Response("Failed to fetch friends", { status: 500 });
        }

        console.log("Raw friends data:", JSON.stringify(friends, null, 2));

        const result: FriendsApiResponse = {
            friends: friends
                .filter(f => f.status === "accepted")
                .map(f => ({
                    id: f.user_id === currentUser.id ? f.friend_id : f.user_id,
                    clerk_id: f.users[0].clerk_id ?? "Unknown",
                    preferred_plant_type: f.users[0].preferred_plant_type ?? undefined,
                })),
            pending: friends
                .filter(f => f.status === "pending" && f.friend_id === currentUser.id)
                .map(f => ({
                    id: f.user_id,
                    clerk_id: f.users[0].clerk_id ?? "Unknown",
                    preferred_plant_type: f.users[0].preferred_plant_type ?? undefined,
                })),
        };

        // Debug: Log mapped result
        console.log("Mapped friends result:", JSON.stringify(result, null, 2));

        return NextResponse.json(result);
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const supabase = await createClient();
        const body = await request.json();
        const { friend_id } = body;

        if (!friend_id || isNaN(friend_id)) {
            return new Response("Valid friend_id required", { status: 400 });
        }

        const { data: currentUser, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_id", userId)
            .single();

        if (userError || !currentUser) {
            console.error("Error fetching current user:", JSON.stringify(userError, null, 2));
            return new Response("User not found", { status: 404 });
        }

        const { data: friend, error: friendError } = await supabase
            .from("users")
            .select("id")
            .eq("id", friend_id)
            .single();

        if (friendError || !friend) {
            console.error("Error fetching friend:", JSON.stringify(friendError, null, 2));
            return new Response("Friend not found", { status: 404 });
        }

        const { data: existing, error: existError } = await supabase
            .from("friends")
            .select("status")
            .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`)
            .or(`user_id.eq.${friend.id},friend_id.eq.${friend.id}`);

        if (existError) {
            console.error("Error checking friendship:", JSON.stringify(existError, null, 2));
            return new Response("Failed to check friendship", { status: 500 });
        }

        if (existing.length > 0) {
            return new Response("Friendship already exists or pending", { status: 400 });
        }

        const { data, error } = await supabase
            .from("friends")
            .insert({
                user_id: currentUser.id,
                friend_id: friend.id,
                status: "pending",
            })
            .select()
            .single();

        if (error) {
            console.error("Error sending friend request:", JSON.stringify(error, null, 2));
            return new Response("Failed to send friend request", { status: 500 });
        }

        return NextResponse.json(data);
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const supabase = await createClient();
        const body = await request.json();
        const { friend_id, action } = body;

        if (!friend_id || !["accept", "reject"].includes(action)) {
            return new Response("Friend ID and valid action (accept/reject) required", { status: 400 });
        }

        const { data: currentUser, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_id", userId)
            .single();

        if (userError || !currentUser) {
            console.error("Error fetching user:", JSON.stringify(userError, null, 2));
            return new Response("User not found", { status: 404 });
        }

        if (action === "accept") {
            const { data, error } = await supabase
                .from("friends")
                .update({ status: "accepted" })
                .eq("user_id", friend_id)
                .eq("friend_id", currentUser.id)
                .eq("status", "pending")
                .select()
                .single();

            if (error || !data) {
                console.error("Error accepting request:", JSON.stringify(error, null, 2));
                return new Response("Failed to accept friend request", { status: 500 });
            }

            const { error: reciprocalError } = await supabase
                .from("friends")
                .insert({
                    user_id: currentUser.id,
                    friend_id: friend_id,
                    status: "accepted",
                });

            if (reciprocalError) {
                console.error("Error inserting reciprocal:", JSON.stringify(reciprocalError, null, 2));
                return new Response("Failed to complete friendship", { status: 500 });
            }

            return NextResponse.json(data);
        } else {
            const { error } = await supabase
                .from("friends")
                .delete()
                .eq("user_id", friend_id)
                .eq("friend_id", currentUser.id)
                .eq("status", "pending");

            if (error) {
                console.error("Error rejecting request:", JSON.stringify(error, null, 2));
                return new Response("Failed to reject friend request", { status: 500 });
            }

            return NextResponse.json({ message: "Friend request rejected" });
        }
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
    }
}