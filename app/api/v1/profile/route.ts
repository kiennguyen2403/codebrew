import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";

// Add cache headers to prevent endless GET requests
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    if (!data) {
      return new Response("User not found", { status: 404 });
    }

    // Add cache-control header to cache response for 5 minutes
    const headers = {
      "Cache-Control": "max-age=300, s-maxage=300, stale-while-revalidate=300",
    };

    return NextResponse.json(data, {
      status: 200,
      headers: headers,
    });
  } catch (e: any) {
    console.error("Server error:", e);
    return new Response(
      JSON.stringify({
        error: e.message || e.toString(),
      }),
      {
        status: 500,
      }
    );
  }
}
