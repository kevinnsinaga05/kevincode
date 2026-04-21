/* Gressoy PWA Service Worker */
const CACHE_NAME = 'gressoy-pwa-v5';
const APP_SHELL = [
  '/',
  '/index.html',
  '/about.html',
  '/produk.html',
  '/blog.html',
  '/manifest.json',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/about.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// Navigation requests: network-first with offline fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isNavigate = req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'));

  if (isNavigate) {
    event.respondWith(
      fetch(req).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // For CSS, use network-first to avoid stale styles
  const isStyle = req.destination === 'style' || req.url.endsWith('.css');
  if (req.method === 'GET' && isStyle) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        return cached || Promise.reject(e);
      }
    })());
    return;
  }

  // Other static assets: cache-first
  if (req.method === 'GET') {
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached || fetch(req).then((resp) => {
            const copy = resp.clone();
            if (resp.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
            }
            return resp;
          }).catch(() => cached)
        );
      })
    );
  }
});
