import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { HeartHandshake } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between p-7 bg-[#E2F687] relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-black/5 rounded-full blur-3xl"></div>
      
      <div className="mt-10 relative z-10 animate-app-in">
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center rotate-3 mb-8 shadow-xl">
           <HeartHandshake className="text-[#E2F687]" size={34} />
        </div>
        <h1 className="text-[3.2rem] font-extrabold text-black leading-[0.9] tracking-tighter mb-10">
          Ajuda<br/>
          Rápida &<br/>
          Real.
        </h1>
      </div>

      <div className="relative z-10 w-full flex-1 flex flex-col justify-end">
        {/* Card Principal de Onboarding */}
        <div className="aspect-[4/5] bg-black rounded-[3rem] mb-8 relative overflow-hidden flex items-end p-8 shadow-2xl border border-white/10 group animate-app-in" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 p-8">
                <div className="w-14 h-14 rounded-full bg-[#E2F687] shadow-[0_0_30px_rgba(226,246,135,0.4)]"></div>
            </div>
            <p className="text-white text-xl font-bold leading-snug opacity-95">
              Conectamos quem precisa de ajuda urgente com quem pode doar em segundos.
            </p>
        </div>

        <div className="space-y-4 pb-safe animate-app-in" style={{ animationDelay: '0.2s' }}>
          <Button fullWidth size="lg" variant="black" onClick={() => navigate('/login')} className="h-16 text-lg">
            Começar Agora
          </Button>
          <div className="text-center">
            <p className="text-[11px] font-black text-black/50 uppercase tracking-[0.2em]">
              Mais de 1.200 famílias ajudadas este mês
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;