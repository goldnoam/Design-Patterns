
const CACHE_NAME = 'cpp-patterns-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/index.css',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/metadata.json',
  '/components/Layout.tsx',
  '/components/PatternCard.tsx',
  '/components/PatternDetail.tsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
