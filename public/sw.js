// Minimal valid Service Worker to satisfy PWA installation requirements natively
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  // Pass through all requests
});
