import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] w-full flex flex-col p-6 bg-[#F8FAF5] relative overflow-hidden">
      <div className="flex flex-col relative z-10 flex-1">
        <header className="flex items-center gap-2 pt-2 mb-8 animate-app-in">
          <img 
            src="https://i.postimg.cc/DyndbWTX/20260202-061526.png" 
            alt="AjudaJá" 
            className="w-10 h-10 object-contain"
          />
          <span className="font-extrabold text-xl tracking-tighter text-black">AjudaJá</span>
        </header>

        <section className="mb-4 animate-app-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-[2.6rem] font-extrabold text-black leading-[1.05] tracking-tighter mb-4">
            Ajuda<br/>Rápida & Real.
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-[260px] leading-snug">
            Conectamos quem precisa de ajuda com quem pode ajudar.
          </p>
        </section>

        <div className="flex-1 flex flex-col items-center justify-center animate-app-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-full max-w-[240px] mb-8">
            <img 
              src="https://i.postimg.cc/15FXPBTV/20260202-061509.png" 
              alt="Mascote AjudaJá" 
              className="w-full h-auto animate-float drop-shadow-2xl"
            />
            <div className="absolute -top-4 -right-2 bg-black text-white px-4 py-2 rounded-2xl rounded-bl-none text-[10px] font-black uppercase tracking-widest shadow-xl">
              Tô aqui!
            </div>
          </div>

          <Button 
            fullWidth 
            size="lg" 
            variant="primary" 
            onClick={() => navigate('/login')} 
            className="h-16 text-lg rounded-full shadow-[0_15px_30px_rgba(226,246,135,0.4)] border-2 border-black/5"
          >
            Começar agora
          </Button>
          
          <p className="mt-4 text-[10px] font-black text-black/20 uppercase tracking-[0.2em] text-center">
            Toque para iniciar sua jornada
          </p>
        </div>
      </div>

      <footer className="pb-safe pt-6 animate-app-in shrink-0 relative z-10" style={{ animationDelay: '0.3s' }}>
        <div className="text-center">
          <p className="text-gray-400 font-bold text-sm">
            Já possui conta? <button onClick={() => navigate('/login')} className="text-black underline">Entrar</button>
          </p>
        </div>
      </footer>

      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#E2F687] rounded-full blur-[100px] opacity-20"></div>
    </div>
  );
};

export default Onboarding;