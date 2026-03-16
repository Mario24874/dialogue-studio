// Service Worker — Italianto Dialogue Studio
// Propósito: habilitar PWA installability (beforeinstallprompt en Chrome Android)
// y cache básico del shell para carga offline.

const CACHE_NAME = "italianto-v1";
const PRECACHE = ["/", "/manifest.json", "/Logo_ItaliAnto.png"];

// ─── Install: pre-cachear recursos estáticos del shell ────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ─── Activate: limpiar caches viejos ─────────────────────────────────────────
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

// ─── Fetch: Network-first para APIs y auth; Cache-first para assets estáticos ─
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Nunca interceptar: llamadas a API, Clerk, Stripe, ElevenLabs
  if (
    url.pathname.startsWith("/api/") ||
    url.hostname.includes("clerk") ||
    url.hostname.includes("stripe") ||
    url.hostname.includes("elevenlabs") ||
    url.hostname.includes("supabase")
  ) {
    return;
  }

  // Para todo lo demás: network-first con fallback a cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Guardar copia en cache si la respuesta es válida
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
