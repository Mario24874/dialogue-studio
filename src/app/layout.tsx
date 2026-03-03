import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import MobileAppBanner from "@/components/layout/mobile-app-banner";

export const metadata: Metadata = {
  title: "Italianto Dialogue Studio",
  description: "Genera diálogos escritos y audios en italiano. Aprende italiano con conversaciones reales generadas por IA.",
  keywords: ["italiano", "aprender italiano", "diálogos italiano", "audio italiano", "italianto"],
  authors: [{ name: "Italianto" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Italianto",
  },
  openGraph: {
    title: "Italianto Dialogue Studio",
    description: "Genera diálogos escritos y audios en italiano con IA",
    type: "website",
    siteName: "Italianto",
  },
  robots: { index: true, follow: true },
};

// Wrapper de Clerk: solo activo cuando las keys están configuradas
async function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }
  const { ClerkProvider } = await import("@clerk/nextjs");
  return <ClerkProvider>{children}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <html lang="es">
        <head>
          <meta name="theme-color" content="#2e7d32" />
          <meta name="mobile-web-app-capable" content="yes" />
          <link rel="apple-touch-icon" href="/Logo_ItaliAnto.png" />
        </head>
        <body>
          <LanguageProvider>
            {children}
            <MobileAppBanner />
          </LanguageProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
