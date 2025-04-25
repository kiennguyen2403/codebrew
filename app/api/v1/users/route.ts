import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { userId, getToken } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return new NextResponse("Missing OpenAI API key", { status: 500 });
        }

        const body = await request.json();

        if (!body.clerk_id) {
            return new NextResponse("Missing clerk_id", { status: 400 });
        }

        if (!body.hobbies || !Array.isArray(body.hobbies) || body.hobbies.length === 0) {
            return new NextResponse("Hobbies must be a non-empty array", { status: 400 });
        }

        if (!body.location || !body.location.type || !body.location.coordinates) {
            return new NextResponse("Invalid location format", { status: 400 });
        }

        const supabase = await createClient();

        const hobbyText = body.hobbies.join(", ");
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: hobbyText,
        });

        const hobbyEmbedding = embeddingResponse.data[0].embedding;

        // Prepare user data with embedding
        const userData = {
            ...body,
            clerk_id: body.clerk_id,
            hobbies: body.hobbies,
            location: body.location,
            hobby_embedding: hobbyEmbedding,
        };

        // Insert user into the database
        const { error } = await supabase.from("users").insert(userData);

        if (error) {
            console.error("Error inserting user:", error);
            return new NextResponse(error.message, { status: 500 });
        }

        return new NextResponse("User created successfully", { status: 201 });
    } catch (error: any) {
        console.error("Server error:", error);
        return NextResponse.json(
            {
                error: error.message,
            },
            { status: 500 }
        );
    }
}