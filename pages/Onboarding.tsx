
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col p-8 bg-[#F8FAF5] relative overflow-hidden">
      <div className="flex flex-col relative z-10 flex-1">
        <header className="flex items-center gap-2 pt-4 mb-12">
          <img 
            src="https://i.postimg.cc/DyndbWTX/20260202-061526.png" 
            alt="AjudaJá" 
            className="w-10 h-10"
          />
          <span className="font-extrabold text-xl tracking-tighter">AjudaJá</span>
        </header>

        <section className="mb-8">
          <h1 className="text-4xl font-extrabold text-black leading-[1.1] tracking-tighter mb-4">
            Ajuda Rápida <br/>e Real.
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-snug">
            Conectamos quem precisa de ajuda with quem quer ajudar, de forma direta e segura.
          </p>
        </section>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[200px] mb-12">
            <img 
              src="https://i.postimg.cc/15FXPBTV/20260202-061509.png" 
              alt="Mascote" 
              className="w-full h-auto animate-float drop-shadow-xl"
            />
          </div>

          <Button 
            fullWidth 
            size="lg" 
            variant="primary" 
            onClick={() => navigate('/login')} 
            className="h-16 text-lg rounded-full"
          >
            Começar agora
          </Button>
        </div>
      </div>

      <footer className="pb-safe pt-8">
        <div className="text-center">
          <p className="text-gray-400 font-bold text-sm">
            Já possui conta? <button onClick={() => navigate('/login')} className="text-black underline">Entrar</button>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
