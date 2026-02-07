
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error('Erro fatal no render inicial:', err);
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 40px; background: #F8FAF5;">
        <div style="max-width: 400px;">
          <h1 style="font-weight: 900; font-size: 28px; margin-bottom: 10px;">Ops! Algo deu errado.</h1>
          <p style="color: #666; margin-bottom: 30px;">Não conseguimos carregar o aplicativo. Verifique sua conexão.</p>
          <button onclick="window.location.reload()" style="background: #000; color: #fff; padding: 18px 40px; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; width: 100%;">Tentar Novamente</button>
        </div>
      </div>
    `;
  }
};

// Executa o mount
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
