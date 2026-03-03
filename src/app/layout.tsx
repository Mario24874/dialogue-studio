import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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

const HAS_CLERK = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const html = (
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
  );

  // Importación estática garantiza que ClerkProvider esté en el bundle del cliente
  // y que el contexto React de Clerk se inicialice correctamente en hidratación.
  if (HAS_CLERK) return <ClerkProvider>{html}</ClerkProvider>;
  return html;
}
