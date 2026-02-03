import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ("serviceWorker" in navigator && window.location.protocol === 'https:') {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .catch(err => console.log("SW registration failed", err));
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}