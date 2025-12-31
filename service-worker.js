// Service Worker for Xeltrix Sales App
const CACHE_NAME = 'xeltrix-sales-app-v1';

// Get the base path
const basePath = self.location.pathname.replace('/service-worker.js', '');

const urlsToCache = [
  basePath + '/',
  basePath + '/index.html',
  basePath + '/style.css',
  basePath + '/script.js',
  basePath + '/firebase-config.js',
  basePath + '/xeltrix-logo.png',
  basePath + '/manifest.json',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event - Network First, then Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache and it's a navigation request, return offline page
            if (event.request.mode === 'navigate') {
              return caches.match(basePath + '/index.html');
            }
          });
      })
  );
});

// Background Sync (for offline data sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sales') {
    event.waitUntil(syncSales());
  }
  if (event.tag === 'sync-visits') {
    event.waitUntil(syncVisits());
  }
});

function syncSales() {
  // This would sync pending sales when back online
  // Implementation depends on your offline queue strategy
  return Promise.resolve();
}

function syncVisits() {
  // This would sync pending visits when back online
  return Promise.resolve();
}

