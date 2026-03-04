import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
  "/manifest.json",        // PWA manifest — archivo estático público
  "/api/stripe/webhook",   // Stripe necesita acceso sin sesión
  "/api/clerk/webhook",    // Clerk necesita acceso sin sesión
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
