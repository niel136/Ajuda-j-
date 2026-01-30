import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { HeartHandshake } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-between p-6 bg-[#E2F687] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4F65E] rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-40 -left-10 w-40 h-40 bg-white rounded-full blur-2xl opacity-40"></div>

      <div className="mt-12 relative z-10">
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center rotate-3 mb-6 shadow-xl">
           <HeartHandshake className="text-[#E2F687]" size={32} />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-[0.95] tracking-tight">
          Ajuda<br/>
          Rápida &<br/>
          Real.
        </h1>
      </div>

      <div className="relative z-10 w-full mb-8">
        {/* Illustration Placeholder - Using a CSS shape for now */}
        <div className="aspect-square bg-gray-900 rounded-[2.5rem] mb-8 relative overflow-hidden flex items-end p-6 shadow-2xl">
            <div className="absolute top-0 right-0 p-8">
                <div className="w-12 h-12 rounded-full bg-[#E2F687] animate-pulse"></div>
            </div>
            <p className="text-white text-lg font-medium leading-relaxed opacity-90">
              "Conectamos quem precisa de ajuda urgente com quem pode doar, em segundos."
            </p>
        </div>

        <div className="space-y-3">
          <Button fullWidth size="lg" onClick={() => navigate('/login')}>
            Começar Agora
          </Button>
          <p className="text-center text-xs font-bold text-gray-900 opacity-60">
            Mais de 1.200 famílias ajudadas este mês.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;