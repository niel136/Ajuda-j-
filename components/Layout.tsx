
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Plus, User, Heart, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MascotAvatar from './MascotAvatar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useApp();
  const location = useLocation();
  
  const isAuthPage = ['/login', '/signup', '/onboarding', '/tipo-conta', '/welcome'].includes(location.pathname);
  const isBusiness = profile?.tipo_conta === 'business';
  
  if (isAuthPage) {
    return <div className="min-h-[100dvh] w-full bg-[#F8FAF5]">{children}</div>;
  }

  const isTabActive = (path: string) => location.pathname === path;

  // Temas dinâmicos
  const bgClass = isBusiness ? 'bg-slate-50' : 'bg-[#F8FAF5]';
  const navBgClass = isBusiness ? 'bg-slate-900/95 text-white' : 'bg-white/95 text-gray-300';
  const accentClass = isBusiness ? 'text-indigo-400' : 'text-[#E2F687]';
  const activeTabClass = isBusiness ? 'text-indigo-400' : 'text-black';

  return (
    <div className={`flex flex-col min-h-[100dvh] w-full max-w-[500px] mx-auto ${bgClass} relative shadow-2xl shadow-black/5`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-40 px-6 py-4 flex justify-between items-center pt-safe border-b border-black/5 ${isBusiness ? 'bg-slate-50/90' : 'bg-[#F8FAF5]/90'} backdrop-blur-md`}>
        <Link to="/" className="flex items-center gap-2 active:scale-95 transition-transform">
            <img 
              src="https://i.postimg.cc/DyndbWTX/20260202-061526.png" 
              alt="AjudaJá" 
              className={`w-8 h-8 object-contain ${isBusiness ? 'grayscale brightness-50' : ''}`}
            />
            <h1 className={`font-extrabold text-xl tracking-tighter ${isBusiness ? 'text-slate-900' : 'text-black'}`}>
              AjudaJá {isBusiness && <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-1">Business</span>}
            </h1>
        </Link>
        {user && (
          <Link to="/perfil" className="btn-active">
            <MascotAvatar 
              seed={profile?.avatar_seed || user.id} 
              size={40} 
              className={`border-2 border-white shadow-md rounded-xl ${isBusiness ? 'grayscale' : ''}`} 
            />
          </Link>
        )}
      </header>

      {/* CONTEÚDO */}
      <main className={`flex-1 px-5 pt-5 pb-36 overflow-x-hidden animate-app-in`}>
        {children}
      </main>

      {/* NAVEGAÇÃO (DOCK) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-6 pb-8 pointer-events-none">
        <nav className={`${navBgClass} backdrop-blur-2xl rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-white/10 px-3 py-2 flex items-center justify-around w-full max-w-[400px] pointer-events-auto`}>
          
          <Link to="/" className={`flex flex-col items-center gap-1 p-3.5 rounded-2xl transition-all btn-active ${isTabActive('/') ? activeTabClass : ''}`}>
            <Home size={24} strokeWidth={isTabActive('/') ? 2.5 : 2} />
          </Link>

          <Link to="/feed" className={`flex flex-col items-center gap-1 p-3.5 rounded-2xl transition-all btn-active ${isTabActive('/feed') ? activeTabClass : ''}`}>
            <Grid size={24} strokeWidth={isTabActive('/feed') ? 2.5 : 2} />
          </Link>

          {!isBusiness && (
            <Link 
              to="/novo-pedido" 
              className="bg-black text-[#E2F687] w-16 h-16 rounded-[2rem] shadow-2xl shadow-black/30 flex items-center justify-center transform -translate-y-8 btn-active transition-all border-[6px] border-[#F8FAF5]"
            >
              <Plus size={36} strokeWidth={3} />
            </Link>
          )}

          {isBusiness && (
            <Link to="/impacto" className={`flex flex-col items-center gap-1 p-3.5 rounded-2xl transition-all btn-active ${isTabActive('/impacto') ? activeTabClass : ''}`}>
              <BarChart3 size={24} strokeWidth={isTabActive('/impacto') ? 2.5 : 2} />
            </Link>
          )}

          {!isBusiness && (
            <Link to="/impacto" className={`flex flex-col items-center gap-1 p-3.5 rounded-2xl transition-all btn-active ${isTabActive('/impacto') ? activeTabClass : ''}`}>
              <Heart size={24} strokeWidth={isTabActive('/impacto') ? 2.5 : 2} />
            </Link>
          )}

          <Link to="/perfil" className={`flex flex-col items-center gap-1 p-3.5 rounded-2xl transition-all btn-active ${isTabActive('/perfil') ? activeTabClass : ''}`}>
            <User size={24} strokeWidth={isTabActive('/perfil') ? 2.5 : 2} />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
