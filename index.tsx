import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro resiliente do Service Worker para PWA
// Em ambientes de desenvolvimento/preview, o Service Worker pode falhar silenciosamente sem quebrar o app
if ("serviceWorker" in navigator && window.location.protocol === 'https:') {
  window.addEventListener("load", () => {
    // Usamos um caminho relativo simples. O navegador resolve contra a base do documento.
    navigator.serviceWorker.register("service-worker.js", { scope: './' })
      .then(reg => {
        console.log("PWA: Service Worker registrado com sucesso no escopo:", reg.scope);
      })
      .catch(err => {
        // Ignoramos erros de 'Invalid State' que ocorrem comumente em previews de browsers
        if (err.name !== 'InvalidStateError') {
          console.warn("PWA: Falha ao registrar Service Worker (esperado em alguns ambientes):", err.message);
        }
      });
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