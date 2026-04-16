import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rutas públicas — no requieren autenticación
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  "/about",
  "/privacy",
  "/terms",
  "/cookies",
  "/manifest.json",
  "/api/stripe/webhook",
  "/api/clerk/webhook",
]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") || "";

  // Redirigir studio.italianto.com → italianto.com/studio
  // para que la sesión de Clerk sea compartida bajo el mismo dominio
  if (host === "studio.italianto.com") {
    const path = req.nextUrl.pathname + req.nextUrl.search;
    return NextResponse.redirect(`https://italianto.com/studio${path}`, 301);
  }

  if (!isPublicRoute(req)) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://italianto.com'
    await auth.protect({ unauthenticatedUrl: `${appUrl}/studio/sign-in` })
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
