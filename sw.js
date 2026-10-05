// Service worker do Backlog de Jogos.
// App (HTML, ícones, manifesto): cache primeiro, atualiza em segundo plano.
// SDK do Firebase e fontes do Google: guardados em cache para o app abrir offline.
// Dados (Firestore) e login nunca passam por aqui: o próprio Firebase cuida do modo offline.
const VERSION = "backlog-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isOwn = url.origin === self.location.origin;
  const isSdk = url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/");
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!isOwn && !isSdk && !isFont) return;
  if (isOwn && url.pathname.includes("/__/")) return; // rotas internas do login do Firebase

  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(e.request);
      const network = fetch(e.request)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
