
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Building2, ChevronRight, ShieldCheck } from 'lucide-react';
import { UserType } from '../types';

const AccountTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (type: UserType) => {
    if (type === 'PF') navigate('/onboarding-pf');
    else if (type === 'PJ') navigate('/onboarding-pj');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-7 flex flex-col pt-safe">
      <header className="mb-12 animate-app-in">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6">
           <ShieldCheck className="text-[#C6F64E]" size={24} />
        </div>
        <h2 className="text-3xl font-black text-black tracking-tighter leading-tight">Como você quer<br/>impactar o mundo?</h2>
        <p className="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest">Escolha sua categoria</p>
      </header>

      <div className="flex flex-col gap-4 flex-1">
        <button
          onClick={() => handleSelect('PF')}
          className="w-full text-left p-6 rounded-[2.5rem] bg-white border border-black/5 flex items-center justify-between active:scale-[0.98] transition-all shadow-sm hover:shadow-md h-32"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <span className="text-lg font-black text-black block">Pessoa Física</span>
              <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-tight">Ajuda direta entre cidadãos</span>
            </div>
          </div>
          <ChevronRight className="text-gray-200" size={24} />
        </button>

        <button
          onClick={() => handleSelect('PJ')}
          className="w-full text-left p-6 rounded-[2.5rem] bg-white border border-black/5 flex items-center justify-between active:scale-[0.98] transition-all shadow-sm hover:shadow-md h-32"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Building2 size={32} className="text-indigo-600" />
            </div>
            <div>
              <span className="text-lg font-black text-black block">Empresa (PJ)</span>
              <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-tight">Responsabilidade social corporativa</span>
            </div>
          </div>
          <ChevronRight className="text-gray-200" size={24} />
        </button>
      </div>

      <footer className="pb-safe mt-6 text-center">
        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">
          Plataforma Segura & Auditada
        </p>
      </footer>
    </div>
  );
};

export default AccountTypeSelection;
