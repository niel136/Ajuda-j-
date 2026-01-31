import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { User, Heart, Building2, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

const AccountTypeSelection: React.FC = () => {
  const { updateUserRole, user } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [businessName, setBusinessName] = useState('');

  const handleFinish = () => {
    if (!selectedRole) return;
    updateUserRole(selectedRole, selectedRole === 'business' ? { businessName } : undefined);
    navigate('/');
  };

  const options = [
    {
      id: 'donor',
      title: 'Quero AJUDAR pessoas',
      description: 'Desejo encontrar causas próximas e fazer doações rápidas via Pix.',
      icon: Heart,
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 'beneficiary',
      title: 'Quero PEDIR AJUDA',
      description: 'Preciso de apoio financeiro ou recursos para uma causa urgente.',
      icon: User,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'business',
      title: 'Sou uma EMPRESA / ONG',
      description: 'Quero gerenciar projetos sociais ou fazer doações corporativas.',
      icon: Building2,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF5] p-7 flex flex-col pt-safe">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-black tracking-tighter">Último passo...</h2>
        <p className="text-gray-400 font-medium mt-2">Como você pretende usar o AjudaJá?</p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-6 animate-app-in">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedRole(opt.id as UserRole)}
            className={`w-full text-left p-5 rounded-[2rem] border-2 transition-all flex items-start gap-4 active:scale-95 ${
              selectedRole === opt.id 
              ? 'border-black bg-white shadow-xl translate-y-[-2px]' 
              : 'border-black/5 bg-white opacity-60'
            }`}
          >
            <div className={`p-4 rounded-2xl ${opt.color}`}>
              <opt.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-black mb-1">{opt.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">{opt.description}</p>
            </div>
            {selectedRole === opt.id && (
              <CheckCircle2 className="text-black" size={20} fill="currentColor" />
            )}
          </button>
        ))}

        {selectedRole === 'business' && (
          <div className="animate-app-in pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome da Instituição</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex: Instituto Esperança"
                className="w-full bg-white border border-black/5 rounded-2xl p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 pb-safe">
        <Button 
          fullWidth 
          size="lg" 
          variant="black" 
          disabled={!selectedRole || (selectedRole === 'business' && !businessName)}
          onClick={handleFinish}
          className="h-16"
        >
          Finalizar Cadastro
        </Button>
      </div>
    </div>
  );
};

export default AccountTypeSelection;