import React from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import Button from './Button';

const InstallBanner: React.FC = () => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div className="bg-black text-white p-3 flex items-center justify-between gap-3 animate-banner border-b border-white/10 relative z-[60]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#E2F687] rounded-xl flex items-center justify-center shrink-0">
          <Smartphone className="text-black" size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#E2F687]">App Oficial</p>
          <p className="text-xs font-bold truncate opacity-80">Baixe o APK para uma melhor experiência</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="primary" 
          size="sm" 
          className="h-9 px-4 text-[11px]" 
          onClick={() => window.open('https://ajuda-ja.vercel.app/ajudaja.apk', '_blank')}
        >
          <Download size={14} className="mr-1" /> Baixar
        </Button>
        <button onClick={() => setVisible(false)} className="p-2 opacity-40 active:scale-90">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;