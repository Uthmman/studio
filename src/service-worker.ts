/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any };

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

// Cache images (including picsum.photos)
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100, // Increased max entries for images
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200], // 0 for opaque responses (e.g. picsum)
      }),
    ],
  })
);

// Cache Next.js data requests (/_next/data/)
registerRoute(
  ({url}) => url.pathname.startsWith('/_next/data/'),
  new StaleWhileRevalidate({
    cacheName: 'next-data',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60, // 1 Day
      }),
    ],
  })
);

// Cache Google Fonts (if any were to be added)
registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60}), // 1 Year
      new CacheableResponsePlugin({statuses: [0, 200]}),
    ],
  })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', () => {
  console.log('Service Worker: Installed');
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // When the service worker is activated, claim clients to take control of the page without needing a refresh.
  event.waitUntil(self.clients.claim());
});
