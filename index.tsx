import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro do Service Worker para PWA com caminho relativo para evitar erro de Cross-Origin
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // Usando caminho relativo 'service-worker.js' em vez de '/service-worker.js'
      const reg = await navigator.serviceWorker.register("service-worker.js", { scope: './' });
      console.log("SW registrado com sucesso no escopo:", reg.scope);
    } catch (e) {
      console.error("Erro crítico ao registrar Service Worker:", e);
    }
  });
}

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}