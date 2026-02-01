import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { HeartHandshake } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] flex flex-col justify-between p-6 bg-[#E2F687] relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-black/5 rounded-full blur-3xl"></div>
      
      {/* Top Header Section */}
      <div className="pt-8 relative z-10 animate-app-in shrink-0">
        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center rotate-3 mb-6 shadow-xl">
           <HeartHandshake className="text-[#E2F687]" size={30} />
        </div>
        <h1 className="text-[2.8rem] font-extrabold text-black leading-[0.9] tracking-tighter mb-4">
          Ajuda<br/>
          Rápida &<br/>
          Real.
        </h1>
      </div>

      {/* Middle Card Section - Flex Grow with Min Height 0 for responsiveness */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center py-4 min-h-0">
        <div className="w-full max-h-[400px] flex-1 bg-black rounded-[2.5rem] relative overflow-hidden flex items-end p-7 shadow-2xl border border-white/10 group animate-app-in" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 p-6">
                <div className="w-12 h-12 rounded-full bg-[#E2F687] shadow-[0_0_25px_rgba(226,246,135,0.4)] animate-pulse"></div>
            </div>
            <p className="text-white text-lg font-bold leading-tight opacity-95 text-balance">
              Conectamos quem precisa de ajuda urgente com quem pode doar em segundos.
            </p>
        </div>
      </div>

      {/* Footer Button Section */}
      <div className="space-y-4 pb-safe animate-app-in shrink-0 mt-4" style={{ animationDelay: '0.2s' }}>
        <Button 
          fullWidth 
          size="lg" 
          variant="black" 
          onClick={() => navigate('/login')} 
          className="h-16 text-lg active:scale-95 transition-transform"
        >
          Começar Agora
        </Button>
        <div className="text-center">
          <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.15em]">
            Mais de 1.200 famílias ajudadas este mês
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;