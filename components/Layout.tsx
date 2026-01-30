import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Plus, User, Heart, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();

  // If on login or onboarding, don't show nav
  if (location.pathname === '/login' || location.pathname === '/onboarding') {
    return <div className="min-h-screen bg-[#E2F687]">{children}</div>;
  }

  const isActive = (path: string) => location.pathname === path 
    ? "bg-gray-900 text-[#E2F687]" 
    : "text-gray-500 hover:text-gray-900";

  return (
    <div className="min-h-screen bg-[#E2F687] pb-24 relative selection:bg-black selection:text-[#E2F687]">
      {/* Dynamic Header depending on page could go here, but handled in pages usually */}
      
      {/* Main Content */}
      <main className="max-w-md mx-auto min-h-screen page-transition pt-safe">
        {children}
      </main>

      {/* Floating Bottom Dock - Premium Style */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-gray-900/10 border border-white/50 px-2 py-2 flex items-center gap-1 max-w-sm w-full justify-between">
          
          <Link to="/" className={`p-3 rounded-full transition-all ${isActive('/')}`}>
            <Home size={24} strokeWidth={2.5} />
          </Link>
          
          <Link to="/feed" className={`p-3 rounded-full transition-all ${isActive('/feed')}`}>
            <Grid size={24} strokeWidth={2.5} />
          </Link>

          {/* Central Create Button */}
          <Link to="/novo-pedido" className="bg-gray-900 text-[#E2F687] p-4 rounded-[1.5rem] shadow-lg transform -translate-y-4 hover:scale-105 transition-transform border-4 border-[#E2F687]">
            <Plus size={28} strokeWidth={3} />
          </Link>

          <Link to="/impacto" className={`p-3 rounded-full transition-all ${isActive('/impacto')}`}>
            <BarChart3 size={24} strokeWidth={2.5} />
          </Link>

          <Link to={user ? "/perfil" : "/login"} className={`p-3 rounded-full transition-all ${isActive('/perfil')}`}>
            <User size={24} strokeWidth={2.5} />
          </Link>

        </nav>
      </div>
    </div>
  );
};

export default Layout;