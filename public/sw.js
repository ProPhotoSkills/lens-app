// Service Worker für PPS Lens (lens-app v5, Cache-Name ab v7 mit Versionsnummer) – macht die App installierbar und zeigt ohne Netz eine Hinweisseite.
// Bewusst schlicht:
//   - Seiten (Navigation): immer zuerst aus dem Netz, nur ohne Netz die Offline-Seite
//   - /assets/ (Dateinamen mit Hash), Icons, Flaggen: aus dem Zwischenspeicher, sonst Netz
//   - Anfragen an andere Adressen (lens-gate, Supabase, OpenAI …) fasst er NIE an → keine Fotos, Bewertungen
//     oder Anmeldedaten im Zwischenspeicher
// Neue Fassung: CACHE hochzählen, dann werden alte Zwischenspeicher gelöscht.
const CACHE = "pps-lens-v9";
const OFFLINE = "/offline"; // Cloudflare liefert offline.html unter /offline aus (ohne .html, sonst Umleitung)
const VORAB = [OFFLINE, "/icon-192.png", "/icon-512.png", "/favicon-32x32.png", "/assets/photoskills-logo.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(VORAB)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Tor, Supabase usw. nie anfassen

  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match(OFFLINE)));
    return;
  }
  const statisch = url.pathname.startsWith("/assets/") || url.pathname.startsWith("/flags/") || /\.(png|ico|svg|webp)$/.test(url.pathname);
  if (statisch) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const kopie = res.clone();
              caches.open(CACHE).then((c) => c.put(req, kopie));
            }
            return res;
          }),
      ),
    );
  }
});
