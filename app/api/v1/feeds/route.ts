// Start of Selection
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("posts")
      .select(
        `
                id,
                content,
                image_url,
                is_question,
                created_at,
                user_id,
                users (
                    clerk_id,
                    name,
                    url
                )
            `
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching posts:", JSON.stringify(error, null, 2));
      return new Response("Failed to fetch posts", { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (e: any) {
    console.error("Server error:", e);
    return NextResponse.json(
      { error: e.message || e.toString() },
      { status: 500 }
    );
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
    const { content, image_url, is_question } = body;

    if (!content) {
      return new Response("Content is required", { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      console.error("Error fetching user:", JSON.stringify(userError, null, 2));
      return new Response("User not found", { status: 404 });
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        content,
        image_url,
        is_question: is_question || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", JSON.stringify(error, null, 2));
      return new Response("Failed to create post", { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Server error:", e);
    return NextResponse.json(
      { error: e.message || e.toString() },
      { status: 500 }
    );
  }
}
