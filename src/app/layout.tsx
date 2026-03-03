import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Italianto Dialogue Studio",
  description: "Genera diálogos escritos y audios en italiano. Aprende italiano con conversaciones reales generadas por IA.",
  keywords: ["italiano", "aprender italiano", "diálogos italiano", "audio italiano", "italianto"],
  authors: [{ name: "Italianto" }],
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
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
