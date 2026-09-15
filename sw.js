const CACHE_NAME = 'quran-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './qstyle.css',
  './qscript.js',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only handle GET requests and avoid caching external APIs in sw cache directly to keep fresh
  if (event.request.method !== 'GET') return;
  
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
