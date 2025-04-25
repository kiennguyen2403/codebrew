// middleware.ts
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { updateSession } from "@/utils/supabase/middleware";

// Define public routes (sign-in and sign-up)
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();

  // Check if the user has just signed up
  const isNewUser = sessionClaims?.isNewUser;

  // Redirect new users to /onboarding, else redirect authenticated users from root (/) to /garden
  if (userId && req.nextUrl.pathname === "/") {
    const redirectUrl = isNewUser ? "/onboarding" : "/garden";
    const homeUrl = new URL(redirectUrl, req.url);
    return NextResponse.redirect(homeUrl);
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect(); // Enforce authentication
  }

  // Run Supabase session update (assuming it needs auth context)
  return await updateSession(req);
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
