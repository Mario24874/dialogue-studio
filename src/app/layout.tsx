import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/contexts/theme-context";
import MobileAppBanner from "@/components/layout/mobile-app-banner";
import SplashScreen from "@/components/splash-screen";
import Onboarding from "@/components/onboarding";

// Only render ClerkProvider when the publishable key is available.
// Without it, @clerk/nextjs v6 throws "Missing publishableKey" which
// causes an "Application error" on the client — especially on mobile.
const HAS_CLERK = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata: Metadata = {
  title: "Dialoghi Studio",
  description: "Genera diálogos escritos y audios en italiano. Aprende italiano con conversaciones reales generadas por IA.",
  keywords: ["italiano", "aprender italiano", "diálogos italiano", "audio italiano", "italianto"],
  authors: [{ name: "Italianto" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dialoghi Studio",
  },
  openGraph: {
    title: "Dialoghi Studio",
    description: "Genera diálogos escritos y audios en italiano con IA",
    type: "website",
    siteName: "Italianto",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const body = (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2e7d32" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/studio/Logo_ItaliAnto.png" />
        {/* Prevent dark mode flash on reload */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if(t==='dark')document.documentElement.classList.add('dark');})();` }} />
        {/* Register Service Worker for PWA installability */}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/studio/sw.js',{scope:'/studio/'});});}` }} />
      </head>
      <body data-v="4">
        <ThemeProvider>
          <LanguageProvider>
            <SplashScreen />
            <Onboarding />
            {children}
            <MobileAppBanner />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );

  return HAS_CLERK ? <ClerkProvider>{body}</ClerkProvider> : body;
}
