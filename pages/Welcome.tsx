
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import MascotAvatar from '../components/MascotAvatar';
import { ChevronRight, Heart, ShieldCheck, Zap } from 'lucide-react';

const Welcome: React.FC = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const cards = [
    {
      title: "Bem-vindo ao AjudaJá! 🐸",
      text: "Eu sou seu guia. Aqui, a solidariedade é levada a sério e cada conexão transforma vidas.",
      icon: <Zap size={40} className="text-[#E2F687]" />
    },
    {
      title: "Segurança em Primeiro Lugar",
      text: "Usamos inteligência artificial e verificação facial para garantir que a ajuda chegue a quem realmente precisa.",
      icon: <ShieldCheck size={40} className="text-blue-500" />
    },
    {
      title: "Impacto em Tempo Real",
      text: "Acompanhe suas doações e veja as provas de impacto enviadas pelos beneficiários diretamente no seu feed.",
      icon: <Heart size={40} className="text-red-500" />
    }
  ];

  const handleNext = () => {
    if (step < cards.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/tipo-conta');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] flex flex-col items-center justify-between p-8 pt-safe">
      <div className="w-full flex justify-center mt-12 mb-8">
        <MascotAvatar seed="welcome-frog" size={140} className="border-4 border-white shadow-2xl rounded-[3rem] animate-bounce" />
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl w-full max-w-[400px] relative overflow-hidden min-h-[280px] flex flex-col justify-center text-center">
        <div className="mb-6 flex justify-center">
            {cards[step].icon}
        </div>
        <h2 className="text-2xl font-black text-black tracking-tighter mb-4 leading-tight">
          {cards[step].title}
        </h2>
        <p className="text-gray-500 font-bold text-sm leading-relaxed">
          {cards[step].text}
        </p>
      </div>

      <div className="w-full max-w-[400px] mb-12">
        <div className="flex gap-2 justify-center mb-10">
          {cards.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-10 bg-black' : 'w-2 bg-gray-200'}`} />
          ))}
        </div>
        
        <Button fullWidth size="lg" variant="black" onClick={handleNext} className="h-16">
          {step === cards.length - 1 ? 'Vamos começar' : 'Continuar'} <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
