import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Plus, User, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();
  
  // Esconder layout em telas de fluxo inicial
  const isAuthPage = ['/login', '/signup', '/onboarding', '/tipo-conta'].includes(location.pathname);
  
  if (isAuthPage) {
    return <div className="min-h-[100dvh] w-full bg-[#F8FAF5]">{children}</div>;
  }

  const isTabActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[500px] mx-auto bg-[#F8FAF5] relative shadow-2xl shadow-black/5">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#F8FAF5]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center pt-safe border-b border-black/5">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Heart size={16} className="text-[#E2F687]" fill="currentColor" />
            </div>
            <h1 className="font-extrabold text-xl tracking-tight text-black">AjudaJá</h1>
        </div>
        {user && (
          <Link to="/perfil" className="btn-active">
            <img src={user.avatarUrl} className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover" alt="Profile" />
          </Link>
        )}
      </header>

      {/* CONTEÚDO */}
      <main className={`flex-1 px-4 pt-4 pb-32 overflow-x-hidden animate-app-in`}>
        {children}
      </main>

      {/* NAVEGAÇÃO (DOCK) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6 pointer-events-none">
        <nav className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white px-2 py-2 flex items-center justify-around w-full max-w-[400px] pointer-events-auto">
          
          <Link to="/" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all btn-active ${isTabActive('/') ? 'text-black' : 'text-gray-300'}`}>
            <Home size={22} strokeWidth={isTabActive('/') ? 2.5 : 2} />
          </Link>

          <Link to="/feed" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all btn-active ${isTabActive('/feed') ? 'text-black' : 'text-gray-300'}`}>
            <Grid size={22} strokeWidth={isTabActive('/feed') ? 2.5 : 2} />
          </Link>

          <Link 
            to="/novo-pedido" 
            className="bg-black text-[#E2F687] w-16 h-16 rounded-[1.8rem] shadow-xl shadow-black/20 flex items-center justify-center transform -translate-y-6 btn-active transition-all border-[6px] border-[#F8FAF5]"
          >
            <Plus size={32} strokeWidth={3} />
          </Link>

          <Link to="/impacto" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all btn-active ${isTabActive('/impacto') ? 'text-black' : 'text-gray-300'}`}>
            <Heart size={22} strokeWidth={isTabActive('/impacto') ? 2.5 : 2} />
          </Link>

          <Link to="/perfil" className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all btn-active ${isTabActive('/perfil') ? 'text-black' : 'text-gray-300'}`}>
            <User size={22} strokeWidth={isTabActive('/perfil') ? 2.5 : 2} />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;