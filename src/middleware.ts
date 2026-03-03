import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware de autenticación con Clerk.
 * Cuando NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY no está configurado
 * (modo preview local), deja pasar todas las peticiones.
 *
 * Para activar Clerk: configura las keys en .env.local
 * y descomentar el bloque de abajo.
 */

// ── MODO PREVIEW (sin Clerk) ─────────────────────────────────────────
export default function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// ── MODO PRODUCCIÓN (con Clerk) ──────────────────────────────────────
// Cuando tengas las keys de Clerk, reemplaza la función de arriba por:
//
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// const isPublicRoute = createRouteMatcher([
//   "/", "/sign-in(.*)", "/sign-up(.*)", "/pricing",
//   "/about", "/privacy", "/terms", "/cookies",
//   "/api/stripe/webhook",
// ]);
// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) await auth.protect();
//   return NextResponse.next();
// });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
