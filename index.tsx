import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// PWA Manifest Generation
const injectManifest = () => {
  const manifest = {
    name: "AjudaJá",
    short_name: "AjudaJá",
    start_url: "/",
    display: "standalone",
    background_color: "#E2F687",
    theme_color: "#E2F687",
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
  const blob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
  link.href = URL.createObjectURL(blob);
  document.head.appendChild(link);
};

injectManifest();

// Progressive Service Worker registration
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    // Note: service-worker.js must be in the public/dist root
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.warn('SW failed', err));
  });
}

const rootElement = document.getElementById('root');
const fallbackElement = document.getElementById('fallback-error');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical Render Error:", error);
    if (fallbackElement) fallbackElement.style.display = 'block';
  }
} else {
  if (fallbackElement) fallbackElement.style.display = 'block';
}