import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";


const sendEmail = async (email: string, subject: string, message: string) => {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: email,
            subject: subject,
            html: message,
        }),
    });
    return res;
};

const sendWarnings = async (userId: string, content: string) => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('users')
            .select('clerk_id')
            .eq('id', userId)
            .single();

        if (error) {
            throw Error("User not found")
        }
        let email

        const client = await clerkClient()
        const clerkUser = await client.users.getUser(data?.clerk_id);
        email = clerkUser.primaryEmailAddress?.emailAddress;

        if (email) {
            const emailResponse = await sendEmail(
                email,
                "Severe Weather Warning",
                content
            );

            if (!emailResponse.ok) {
                throw Error("Email sent fail")
            }
            console.log("Email sent successfully");
            return { body: { success: true }, status: 200 }
        } else {
            throw Error("No email found")
        }
    } catch (e: any) {
        console.error("Server error:", e);
        return { body: { error: e.message }, status: 500 }
    }

}

export async function GET() {
    const { body, status } = await sendWarnings("1", "TEST")
    return NextResponse.json(body, { status })
}

export async function POST(request: NextRequest) {
    const { userId, content } = await request.json();
    console.log("Users ID", userId)
    const { body, status } = await sendWarnings(userId, content)
    return NextResponse.json(body, { status })
}