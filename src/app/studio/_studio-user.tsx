"use client";

import { useUser, UserButton } from "@clerk/nextjs";

// Loaded client-side only (ssr: false in page.tsx) — useUser requires the
// Clerk React context which is not available during build-time prerendering.
export default function StudioUser() {
  const { user } = useUser();
  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:block text-xs text-gray-400">
        {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}
      </span>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
