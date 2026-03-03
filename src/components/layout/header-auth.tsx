"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// This file is loaded client-side only (ssr: false in header.tsx).
// Clerk's SignedIn/SignedOut/UserButton require the Clerk React context which
// is unavailable during Next.js build-time static prerendering.

export function HeaderAuthDesktop({
  signInLabel,
  signUpLabel,
  studioLabel,
}: {
  signInLabel: string;
  signUpLabel: string;
  studioLabel: string;
}) {
  return (
    <>
      <SignedOut>
        <Link
          href="/sign-in"
          className="hidden sm:inline-flex text-sm font-medium text-italianto-800 hover:text-italianto-900 transition-colors px-2"
        >
          {signInLabel}
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-2 bg-italianto-800 text-white text-sm font-semibold rounded-lg hover:bg-italianto-900 transition-colors"
        >
          {signUpLabel}
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/studio"
          className="hidden sm:inline-flex px-4 py-2 bg-italianto-800 text-white text-sm font-semibold rounded-lg hover:bg-italianto-900 transition-colors"
        >
          {studioLabel}
        </Link>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
}

export function HeaderAuthMobile({
  signInLabel,
  studioLabel,
  onNavigate,
}: {
  signInLabel: string;
  studioLabel: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <SignedOut>
        <Link
          href="/sign-in"
          onClick={onNavigate}
          className="py-2 text-italianto-800 font-semibold"
        >
          {signInLabel}
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/studio"
          onClick={onNavigate}
          className="py-2 text-italianto-800 font-semibold"
        >
          {studioLabel}
        </Link>
      </SignedIn>
    </>
  );
}
