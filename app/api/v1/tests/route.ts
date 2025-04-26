import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    console.log(req.method)
    return new NextResponse("OK", { status: 200 })
}