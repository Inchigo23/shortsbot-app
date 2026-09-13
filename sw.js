// ShortsBot app: guarda la página para que abra rápido y sin conexión. Los datos (API de GitHub) nunca se guardan aquí.
const CACHE = "shortsbot-app-v1";
const BASICO = ["./", "./index.html", "./manifest.webmanifest", "./icono-192.png", "./icono-512.png", "./privacidad.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICO)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;  // la API de GitHub va siempre directa
  e.respondWith(
    fetch(e.request)
      .then((r) => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); } return r; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("./")))
  );
});
