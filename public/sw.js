// ponytail: cache runtime maison plutôt que next-pwa/workbox. Les assets Next
// ont des noms hashés inconnus au moment d'écrire ce fichier, donc on remplit
// le cache au fil des requêtes au lieu de précacher une liste figée.
// Bump CACHE pour forcer le renouvellement après un déploiement.
const CACHE = "fitweek-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(["/", "/manifest.json", "/icon-192.png", "/icon-512.png"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  // Navigation : réseau d'abord pour attraper une nouvelle version, repli sur
  // la page en cache si on est hors ligne.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          e.waitUntil(caches.open(CACHE).then((c) => c.put("/", copy)));
          return res;
        })
        .catch(() => caches.match("/").then((hit) => hit || Response.error())),
    );
    return;
  }

  // Assets : cache d'abord, et on garde ce qui passe.
  e.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            e.waitUntil(caches.open(CACHE).then((c) => c.put(req, copy)));
          }
          return res;
        }),
    ),
  );
});
