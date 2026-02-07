
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error('Falha crítica no Bootstrap do React:', err);
    // Fallback UI minimalista sem dependências
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 40px; background: #F8FAF5;">
        <div style="max-width: 400px;">
          <h1 style="font-weight: 900; font-size: 28px; margin-bottom: 10px; color: #000;">Ops! Quase lá.</h1>
          <p style="color: #666; margin-bottom: 30px; line-height: 1.5;">O aplicativo encontrou um erro ao iniciar. Isso pode acontecer devido a uma conexão instável.</p>
          <button onclick="window.location.reload()" style="background: #000; color: #fff; padding: 18px 40px; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; width: 100%; font-size: 16px;">Recarregar Agora</button>
        </div>
      </div>
    `;
  }
}
