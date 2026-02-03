import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] w-full flex flex-col p-6 bg-[#F8FAF5] relative overflow-hidden justify-between">
      
      <div className="flex flex-col relative z-10">
        {/* Logo */}
        <header className="flex items-center gap-2 pt-2 mb-8 animate-app-in">
          <img 
            src="https://i.postimg.cc/DyndbWTX/20260202-061526.png" 
            alt="AjudaJá" 
            className="w-10 h-10 object-contain"
          />
          <span className="font-extrabold text-xl tracking-tighter text-black">AjudaJá</span>
        </header>

        {/* Headline */}
        <section className="mb-4 animate-app-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-[2.6rem] font-extrabold text-black leading-[1.05] tracking-tighter mb-4">
            Ajuda<br/>Rápida & Real.
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-[260px] leading-snug">
            Conectamos quem precisa de ajuda com quem pode ajudar.
          </p>
        </section>

        {/* Mascote Acolhedor */}
        <div className="animate-app-in flex justify-center py-4" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-full max-w-[280px]">
            <img 
              src="https://i.postimg.cc/15FXPBTV/20260202-061509.png" 
              alt="Mascote AjudaJá" 
              className="w-full h-auto animate-float drop-shadow-2xl"
            />
            {/* Balão de fala discreto */}
            <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-2 rounded-2xl rounded-bl-none text-[10px] font-black uppercase tracking-widest shadow-xl">
              Vamos juntos?
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé e Botão */}
      <footer className="pb-safe animate-app-in shrink-0 relative z-10" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-[2.5rem] border border-black/5 mb-6">
           <p className="text-black text-xs font-bold leading-tight opacity-90 text-center">
             Segurança via Pix e transparência com Inteligência Artificial.
           </p>
        </div>

        <Button 
          fullWidth 
          size="lg" 
          variant="black" 
          onClick={() => navigate('/login')} 
          className="h-16 text-lg shadow-2xl"
        >
          Começar agora
        </Button>
        
        <div className="text-center mt-5">
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">
            Mais de 1.200 famílias impactadas
          </p>
        </div>
      </footer>

      {/* Elemento de fundo decorativo */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#E2F687] rounded-full blur-[100px] opacity-20"></div>
    </div>
  );
};

export default Onboarding;