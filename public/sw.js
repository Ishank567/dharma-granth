// Offline support: pages you have opened keep working without a network.
//   • HTML pages       network-first, cached copy when offline (capped)
//   • /_next/static/*  cache-first (fingerprinted, never changes)
//   • icons, fonts     stale-while-revalidate
// Everything else (large JSON data, analytics) goes straight to the network.
const VERSION = 'dg-v1';
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const MAX_PAGES = 80;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

const OFFLINE_HTML =
  '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Offline</title><body style="font-family:system-ui;text-align:center;padding:3rem 1rem;background:#fdfbf7;color:#3b2a1a">' +
  '<h1>आप ऑफ़लाइन हैं</h1><p>You are offline. Pages you have already opened are still available.</p>';

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok) {
            const cache = await caches.open(PAGES);
            await cache.put(req, res.clone());
            trim(PAGES, MAX_PAGES);
          }
          return res;
        } catch {
          const cached = await caches.match(req, { cacheName: PAGES });
          return (
            cached ||
            new Response(OFFLINE_HTML, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
          );
        }
      })(),
    );
    return;
  }

  if (url.pathname.includes('/_next/static/')) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req, { cacheName: ASSETS });
        if (cached) return cached;
        const res = await fetch(req);
        if (res.ok) (await caches.open(ASSETS)).put(req, res.clone());
        return res;
      })(),
    );
    return;
  }

  if (/\/icons\/|\.(woff2?|ttf)$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSETS);
        const cached = await cache.match(req);
        const fresh = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || fresh;
      })(),
    );
  }
});
