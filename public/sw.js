// Service Worker — Italianto Dialogue Studio
// v4: Never cache navigation requests (HTML pages).
// Prevents stale HTML causing "old chunk" errors after redeploys.

const CACHE_NAME = "italianto-studio-v4";
const PRECACHE = [
  "/studio/manifest.json",
  "/studio/Logo_ItaliAnto.png",
];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ─── Activate: delete old caches ─────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.protocol !== "https:" && url.protocol !== "http:") return;

  // CRITICAL: Never intercept navigation (HTML page loads).
  // HTML references Next.js chunk hashes that change on every deploy.
  // Serving cached HTML after a redeploy causes "chunk not found" errors.
  if (event.request.mode === "navigate") return;

  // Never intercept: API calls, auth, payment, media services
  if (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("clerk") ||
    url.hostname.includes("stripe") ||
    url.hostname.includes("elevenlabs") ||
    url.hostname.includes("supabase")
  ) {
    return;
  }

  // Only cache Next.js static assets — immutable (chunk hash in filename)
  if (url.pathname.startsWith("/studio/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res.ok && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Static public assets: network-first, cache fallback
  if (
    url.pathname.startsWith("/studio/Logo_ItaliAnto.png") ||
    url.pathname === "/studio/manifest.json" ||
    url.pathname === "/studio/favicon.ico"
  ) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
