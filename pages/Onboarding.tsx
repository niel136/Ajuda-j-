
import React from 'react';
import { useNavigate } from 'react-router';
import Button from '../components/Button';
import { ArrowRight, LogIn } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col p-10 bg-[#C6F64E] relative overflow-hidden">
      {/* Background circles for premium texture */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-20 w-60 h-60 bg-[#111111]/5 rounded-full blur-3xl"></div>

      <div className="flex flex-col relative z-10 flex-1 justify-between">
        <header className="flex items-center gap-2 pt-4">
          <div className="w-10 h-10 bg-[#111111] rounded-xl flex items-center justify-center">
            <img 
              src="https://i.postimg.cc/DyndbWTX/20260202-061526.png" 
              alt="AjudaJá" 
              className="w-6 h-6 brightness-0 invert"
            />
          </div>
          <span className="font-extrabold text-xl tracking-tighter text-[#111111]">AjudaJá</span>
        </header>

        <section className="mt-12">
          <h1 className="text-[3.5rem] font-black text-[#111111] leading-[0.9] tracking-tighter mb-8">
            Impacto <br/>Real. <br/><span className="opacity-40">Agora.</span>
          </h1>
          <p className="text-[#111111] font-bold text-lg leading-snug max-w-[280px]">
            Conectando solidariedade com a agilidade de um banco digital.
          </p>
        </section>

        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[220px] mb-12">
            <img 
              src="https://i.postimg.cc/15FXPBTV/20260202-061509.png" 
              alt="Mascote" 
              className="w-full h-auto animate-float drop-shadow-2xl"
            />
          </div>

          <div className="w-full space-y-3">
            <Button 
              fullWidth 
              size="lg" 
              variant="black" 
              onClick={() => navigate('/signup')} 
              className="h-20 text-xl rounded-[2.5rem] flex justify-between px-10 shadow-2xl"
            >
              Começar
              <ArrowRight size={24} className="text-[#C6F64E]" />
            </Button>
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full h-16 bg-white/20 backdrop-blur-md rounded-[2rem] border border-white/30 text-[#111111] font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <LogIn size={20} /> Entrar na conta
            </button>
          </div>
        </div>
      </div>

      <footer className="pb-safe pt-8 relative z-10">
        <div className="text-center">
          <p className="text-[#111111]/40 font-black text-[10px] uppercase tracking-widest">
            Auditado & Seguro
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
