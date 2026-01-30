import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Dynamic PWA Manifest Injection
const manifest = {
  name: "AjudaJá",
  short_name: "AjudaJá",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#2563EB",
  icons: [
    {
      src: "https://picsum.photos/192/192",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "https://picsum.photos/512/512",
      sizes: "512x512",
      type: "image/png"
    }
  ]
};

const link = document.createElement('link');
link.rel = 'manifest';
const stringManifest = JSON.stringify(manifest);
const blob = new Blob([stringManifest], {type: 'application/json'});
const manifestURL = URL.createObjectURL(blob);
link.href = manifestURL;
document.head.appendChild(link);

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);