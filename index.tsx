
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
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px; background: #F8FAF5;">
        <div>
          <h1 style="font-weight: 900; font-size: 24px;">Ops! O AjudaJá falhou ao iniciar.</h1>
          <p style="color: #666; margin: 20px 0;">Isso pode ser um erro temporário de conexão ou de cache.</p>
          <button onclick="window.location.reload()" style="background: #000; color: #fff; padding: 15px 30px; border: none; border-radius: 15px; font-weight: bold; cursor: pointer;">Recarregar Aplicativo</button>
        </div>
      </div>
    `;
  }
}
