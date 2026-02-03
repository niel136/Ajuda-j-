
import React, { useEffect, useState } from 'react';
import { Smartphone, Download, X, Star } from 'lucide-react';
import Button from './Button';

const InstallBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Verificamos se o usuário já fechou o banner nesta sessão para não ser invasivo
    const isDismissed = sessionStorage.getItem('ajudaJa_banner_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => setVisible(true), 1500); // Delay suave para não assustar no load
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('ajudaJa_banner_dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 pt-safe animate-banner pointer-events-none">
      <div className="bg-black text-white p-4 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between gap-3 pointer-events-auto max-w-[460px] mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 bg-[#E2F687] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(226,246,135,0.2)]">
            <Smartphone className="text-black" size={24} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
               <span className="text-[10px] font-black uppercase tracking-widest text-[#E2F687]">Disponível</span>
               <div className="flex text-[#E2F687]">
                  {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="currentColor" />)}
               </div>
            </div>
            <p className="text-sm font-extrabold truncate leading-tight">Instale o App Nativo</p>
            <p className="text-[10px] font-medium opacity-60 truncate">Mais rápido, seguro e notificações reais.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Button 
            variant="primary" 
            size="sm" 
            className="h-10 px-5 text-xs font-black shadow-none" 
            onClick={() => window.open('https://ajuda-ja.vercel.app/ajudaja.apk', '_blank')}
          >
            <Download size={14} className="mr-1.5" /> Instalar
          </Button>
          <button 
            onClick={handleDismiss} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all text-white/40"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
