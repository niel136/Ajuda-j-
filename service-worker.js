/* eslint-disable no-restricted-globals */
// This service worker handles background push notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Event triggered when the backend sends a push message
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'AjudaJá', body: 'Nova atualização disponível.' };

  const options = {
    body: data.body,
    icon: 'https://picsum.photos/192/192', // App icon placeholder
    badge: 'https://picsum.photos/96/96',   // Small monochromatic icon
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Event triggered when user clicks the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus if already open
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new if not
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});