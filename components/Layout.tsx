
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Grid, Plus, User, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MascotAvatar from './MascotAvatar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useApp();
  const location = useLocation();
  
  const isAuthPage = ['/login', '/signup', '/onboarding', '/tipo-conta', '/welcome'].includes(location.pathname);
  const isPJ = profile?.tipo_usuario === 'PJ';
  
  if (isAuthPage) {
    return <div className="min-h-[100dvh] w-full bg-[#F6F6F6]">{children}</div>;
  }

  // Se for PJ, o layout é controlado pelo DashboardPJ.tsx para manter o estilo corporativo.
  if (isPJ && location.pathname === '/') {
    return <>{children}</>;
  }

  const isTabActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[500px] mx-auto bg-[#F6F6F6] relative shadow-2xl shadow-black/5 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 px-5 py-5 flex justify-between items-center pt-safe bg-[#F6F6F6]/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-[#111111] rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src="https://i.postimg.cc/DyndbWTX/20260202-061526.png" 
                alt="AjudaJá" 
                className="w-6 h-6 brightness-0 invert"
              />
            </div>
            <h1 className="font-black text-xl tracking-tighter text-[#111111]">
              AjudaJá
            </h1>
        </Link>
        {user && (
          <Link to="/perfil" className="btn-active">
            <MascotAvatar 
              seed={profile?.avatar_seed || user.id} 
              size={44} 
              className="border-2 border-white shadow-md rounded-2xl" 
            />
          </Link>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-5 pt-4 pb-32 overflow-x-hidden animate-app-in w-full">
        {children}
      </main>

      {/* DOCK NAVIGATION (FLOATING) */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-5 pointer-events-none">
        <nav className="bg-[#111111]/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 p-1.5 flex items-center justify-between w-full max-w-[380px] pointer-events-auto h-20">
          
          <Link to="/" className={`flex-1 flex justify-center p-4 rounded-3xl transition-all ${isTabActive('/') ? 'text-[#C6F64E]' : 'text-white/30 hover:text-white'}`}>
            <Home size={22} strokeWidth={isTabActive('/') ? 2.5 : 2} />
          </Link>

          <Link to="/feed" className={`flex-1 flex justify-center p-4 rounded-3xl transition-all ${isTabActive('/feed') ? 'text-[#C6F64E]' : 'text-white/30 hover:text-white'}`}>
            <Grid size={22} strokeWidth={isTabActive('/feed') ? 2.5 : 2} />
          </Link>

          <Link 
            to="/novo-pedido" 
            className="bg-[#C6F64E] text-[#111111] w-14 h-14 rounded-[1.5rem] shadow-xl flex items-center justify-center active:scale-90 transition-all mx-1.5"
          >
            <Plus size={30} strokeWidth={3} />
          </Link>

          <Link to="/impacto" className={`flex-1 flex justify-center p-4 rounded-3xl transition-all ${isTabActive('/impacto') ? 'text-[#C6F64E]' : 'text-white/30 hover:text-white'}`}>
            <BarChart3 size={22} strokeWidth={isTabActive('/impacto') ? 2.5 : 2} />
          </Link>

          <Link to="/perfil" className={`flex-1 flex justify-center p-4 rounded-3xl transition-all ${isTabActive('/perfil') ? 'text-[#C6F64E]' : 'text-white/30 hover:text-white'}`}>
            <User size={22} strokeWidth={isTabActive('/perfil') ? 2.5 : 2} />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
