"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import LanguageSelector from "@/components/ui/language-selector";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

let SignedIn: React.FC<{ children: React.ReactNode }>;
let SignedOut: React.FC<{ children: React.ReactNode }>;
let UserButton: React.FC<{ afterSignOutUrl?: string }>;

if (hasClerk) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const clerk = require("@clerk/nextjs");
  SignedIn = clerk.SignedIn;
  SignedOut = clerk.SignedOut;
  UserButton = clerk.UserButton;
} else {
  // eslint-disable-next-line react/display-name
  SignedIn = () => null;
  // eslint-disable-next-line react/display-name
  SignedOut = ({ children }) => <>{children}</>;
  // eslint-disable-next-line react/display-name
  UserButton = () => null;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-italianto-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Image src="/Logo_ItaliAnto.png" alt="Italianto" width={52} height={52} className="rounded-xl" />
          <span className="font-bold text-italianto-800 text-xl leading-tight">
            Italianto<br />
            <span className="text-xs font-medium text-italianto-500 leading-none">Dialogue Studio</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/#features" className="hover:text-italianto-700 transition-colors">{t("nav.features")}</Link>
          <Link href="/pricing" className="hover:text-italianto-700 transition-colors">{t("nav.pricing")}</Link>
          <Link href="/about" className="hover:text-italianto-700 transition-colors">{t("nav.about")}</Link>
        </nav>

        {/* Auth + Language */}
        <div className="flex items-center gap-2">
          <LanguageSelector />

          <SignedOut>
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex text-sm font-medium text-italianto-800 hover:text-italianto-900 transition-colors px-2"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-italianto-800 text-white text-sm font-semibold rounded-lg hover:bg-italianto-900 transition-colors"
            >
              {t("nav.signUp")}
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/studio"
              className="hidden sm:inline-flex px-4 py-2 bg-italianto-800 text-white text-sm font-semibold rounded-lg hover:bg-italianto-900 transition-colors"
            >
              {t("nav.goToStudio")}
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-italianto-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-italianto-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link href="/#features" onClick={() => setMenuOpen(false)} className="py-2 text-gray-700 hover:text-italianto-700">{t("nav.features")}</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)} className="py-2 text-gray-700 hover:text-italianto-700">{t("nav.pricing")}</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="py-2 text-gray-700 hover:text-italianto-700">{t("nav.about")}</Link>
          <SignedOut>
            <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="py-2 text-italianto-800 font-semibold">{t("nav.signIn")}</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/studio" onClick={() => setMenuOpen(false)} className="py-2 text-italianto-800 font-semibold">{t("nav.goToStudio")}</Link>
          </SignedIn>
        </div>
      )}
    </header>
  );
}
