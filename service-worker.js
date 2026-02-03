/* eslint-disable no-restricted-globals */
const CACHE_NAME = "ajudaja-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["./", "manifest.json"])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  /**
   * O evento fetch é obrigatório para que o Chrome considere o site instalável.
   * Implementamos uma estratégia de Cache First com fallback para Network.
   */
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});