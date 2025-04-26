import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";


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

export async function POST(request: NextRequest) {
    try {
        const { userId, content } = await request.json();
        let email

        const client = await clerkClient()
        const clerkUser = await client.users.getUser(userId);
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
            return NextResponse.json({ success: true }, { status: 204 });
        } else {
            throw Error("No email found")
        }
    } catch (e: any) {
        console.error("Server error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}