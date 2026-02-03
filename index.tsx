import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global para armazenar o prompt de instalação
let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Previne que o mini-infobar apareça no mobile
  e.preventDefault();
  // Guarda o evento para ser disparado manualmente
  deferredPrompt = e;
  // Dispara um evento customizado para notificar os componentes React
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: true }));
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  console.log('AjudaJá foi instalado com sucesso!');
});

// Exporta função para disparar a instalação
export const installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Usuário escolheu: ${outcome}`);
    deferredPrompt = null;
    window.dispatchEvent(new CustomEvent('pwa-installable', { detail: false }));
  }
};

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('PWA Service Worker ativo'))
      .catch(err => console.log('Erro ao registrar SW PWA', err));
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