import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Plus, User, BarChart3, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/onboarding') {
    return <div className="min-h-screen bg-[#E2F687]">{children}</div>;
  }

  const isActive = (path: string) => location.pathname === path 
    ? "bg-gray-900 text-[#E2F687]" 
    : "text-gray-500 hover:text-gray-900 hover:bg-black/5";

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${isActive(to)}`}>
      <Icon size={24} strokeWidth={2.5} />
      <span className="font-bold hidden lg:block">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#E2F687] flex flex-col md:flex-row selection:bg-black selection:text-[#E2F687]">
      
      {/* SIDEBAR - VISÍVEL APENAS EM MD/LG (Tablet/Desktop) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-white/50 backdrop-blur-xl border-r border-black/5 h-screen sticky top-0 z-50 p-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-gray-900 p-2 rounded-xl text-[#E2F687]">
            <HeartHandshake size={24} />
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden lg:block">AjudaJá</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem to="/" icon={Home} label="Início" />
          <NavItem to="/feed" icon={Grid} label="Explorar" />
          <NavItem to="/impacto" icon={BarChart3} label="Impacto" />
          <NavItem to={user ? "/perfil" : "/login"} icon={User} label="Perfil" />
        </nav>

        <Link to="/novo-pedido" className="mt-auto bg-gray-900 text-[#E2F687] p-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl shadow-black/10">
          <Plus size={24} strokeWidth={3} />
          <span className="font-bold hidden lg:block">Novo Pedido</span>
        </Link>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-safe pb-24 md:pb-8 page-transition">
        {children}
      </main>

      {/* BOTTOM DOCK - VISÍVEL APENAS EM MOBILE (SM) */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pb-safe">
        <nav className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-gray-900/10 border border-white/50 px-2 py-2 flex items-center gap-1 max-w-sm w-full justify-between">
          <Link to="/" className={`p-3 rounded-full transition-all ${location.pathname === '/' ? 'bg-gray-900 text-[#E2F687]' : 'text-gray-500'}`}>
            <Home size={24} strokeWidth={2.5} />
          </Link>
          <Link to="/feed" className={`p-3 rounded-full transition-all ${location.pathname === '/feed' ? 'bg-gray-900 text-[#E2F687]' : 'text-gray-500'}`}>
            <Grid size={24} strokeWidth={2.5} />
          </Link>

          <Link to="/novo-pedido" className="bg-gray-900 text-[#E2F687] p-4 rounded-[1.5rem] shadow-lg transform -translate-y-4 hover:scale-105 transition-transform border-4 border-[#E2F687]">
            <Plus size={28} strokeWidth={3} />
          </Link>

          <Link to="/impacto" className={`p-3 rounded-full transition-all ${location.pathname === '/impacto' ? 'bg-gray-900 text-[#E2F687]' : 'text-gray-500'}`}>
            <BarChart3 size={24} strokeWidth={2.5} />
          </Link>
          <Link to={user ? "/perfil" : "/login"} className={`p-3 rounded-full transition-all ${location.pathname === '/perfil' ? 'bg-gray-900 text-[#E2F687]' : 'text-gray-500'}`}>
            <User size={24} strokeWidth={2.5} />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Layout;