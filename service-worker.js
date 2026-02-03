/* eslint-disable no-restricted-globals */

// Service Worker simplificado para reconhecimento de PWA
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Estratégia básica de fetch (pode ser expandida para offline futuramente)
});