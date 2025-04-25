// app/page.tsx
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <h1 className="text-2xl font-bold">Welcome to your dashboard 🎉</h1>
      </SignedIn>
    </>
  );
}
