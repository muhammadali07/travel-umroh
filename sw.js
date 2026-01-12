
const CACHE_NAME = 'albarkah-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/metadata.json',
  '/favicon.svg'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip caching for Vite dev server files
  if (url.pathname.startsWith('/@vite/') ||
      url.pathname.startsWith('/@react-refresh') ||
      url.pathname.startsWith('/node_modules/') ||
      event.request.url.includes('hot-update')) {
    return;
  }

  // Skip caching for non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip caching for browser extension requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not successful
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Add to cache
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch((error) => {
        // If both cache and network fail, return error
        console.error('Fetch failed:', error);
        throw error;
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
