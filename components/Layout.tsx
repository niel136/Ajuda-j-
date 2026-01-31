import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Plus, User, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();

  // Esconde navegação em telas de fluxo inicial
  if (location.pathname === '/login' || location.pathname === '/onboarding') {
    return <div className="min-h-[100dvh] bg-[#E2F687]">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-md mx-auto relative bg-[#E2F687]">
      
      {/* HEADER MOBILE FIXO (Opcional, mas dá cara de App) */}
      <header className="sticky top-0 z-40 bg-[#E2F687]/80 backdrop-blur-lg px-6 py-4 flex justify-between items-center pt-safe">
        <h1 className="font-extrabold text-xl tracking-tight text-gray-900">AjudaJá</h1>
        {user && (
          <Link to="/perfil">
            <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-black/10" alt="Profile" />
          </Link>
        )}
      </header>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 px-5 pb-32 pt-2 page-transition overflow-x-hidden">
        {children}
      </main>

      {/* BOTTOM NAVIGATION - ESTILO DOCK NATIVO */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6 pointer-events-none">
        <nav className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 px-2 py-2 flex items-center justify-between w-full max-w-sm pointer-events-auto">
          <Link to="/" className={`p-3.5 rounded-full transition-all active:scale-90 ${location.pathname === '/' ? 'bg-black text-[#E2F687]' : 'text-gray-400'}`}>
            <Home size={24} strokeWidth={2.5} />
          </Link>
          <Link to="/feed" className={`p-3.5 rounded-full transition-all active:scale-90 ${location.pathname === '/feed' ? 'bg-black text-[#E2F687]' : 'text-gray-400'}`}>
            <Grid size={24} strokeWidth={2.5} />
          </Link>

          {/* Botão de Ação Central em Destaque */}
          <Link to="/novo-pedido" className="bg-black text-[#E2F687] p-4.5 rounded-[1.8rem] shadow-xl transform -translate-y-4 active:scale-95 transition-all border-4 border-[#E2F687]">
            <Plus size={30} strokeWidth={3} />
          </Link>

          <Link to="/impacto" className={`p-3.5 rounded-full transition-all active:scale-90 ${location.pathname === '/impacto' ? 'bg-black text-[#E2F687]' : 'text-gray-400'}`}>
            <BarChart3 size={24} strokeWidth={2.5} />
          </Link>
          <Link to={user ? "/perfil" : "/login"} className={`p-3.5 rounded-full transition-all active:scale-90 ${location.pathname === '/perfil' ? 'bg-black text-[#E2F687]' : 'text-gray-400'}`}>
            <User size={24} strokeWidth={2.5} />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;