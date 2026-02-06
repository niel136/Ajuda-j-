
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Heart, Building2, ChevronRight } from 'lucide-react';
import { UserRole } from '../types';

const AccountTypeSelection: React.FC = () => {
  const { updateUserRole } = useApp();
  const navigate = useNavigate();

  const handleSelect = (role: UserRole) => {
    updateUserRole(role);
    // Armazenamos a role temporariamente para o cadastro se necessário
    localStorage.setItem('ajudaJa_pending_role', role);
    navigate('/signup');
  };

  const options = [
    {
      id: 'beneficiary',
      title: '🙋‍♀️ Preciso de ajuda',
      icon: User,
      color: 'bg-blue-50 text-blue-600',
      description: 'Estou passando por uma necessidade urgente.'
    },
    {
      id: 'donor',
      title: '🤝 Quero ajudar',
      icon: Heart,
      color: 'bg-red-50 text-red-600',
      description: 'Quero doar recursos ou tempo para quem precisa.'
    },
    {
      id: 'business',
      title: '🏢 Sou empresa',
      icon: Building2,
      color: 'bg-purple-50 text-purple-600',
      description: 'Minha empresa quer gerar impacto social real.'
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF5] p-7 flex flex-col pt-safe justify-between">
      <div className="flex flex-col">
        <header className="mb-10 animate-app-in">
          <h2 className="text-3xl font-extrabold text-black tracking-tighter leading-tight">Como você quer<br/>usar o AjudaJá?</h2>
          <p className="text-gray-400 font-medium mt-2">Escolha seu perfil para personalizar sua experiência.</p>
        </header>

        <div className="flex flex-col gap-4 animate-app-in" style={{ animationDelay: '0.1s' }}>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id as UserRole)}
              className="w-full text-left p-6 rounded-[2.5rem] bg-white border border-black/5 transition-all flex items-center justify-between active:scale-[0.97] group shadow-sm hover:shadow-md h-28"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${opt.color}`}>
                  <opt.icon size={28} />
                </div>
                <div className="min-w-0">
                  <span className="text-lg font-extrabold text-black block truncate">{opt.title}</span>
                  <span className="text-[11px] font-medium text-gray-400 block truncate">{opt.description}</span>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-black transition-colors shrink-0" size={24} />
            </button>
          ))}
        </div>
      </div>

      <footer className="pb-safe mt-6 text-center animate-app-in" style={{ animationDelay: '0.2s' }}>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
          Transparência e segurança em cada conexão
        </p>
      </footer>
    </div>
  );
};

export default AccountTypeSelection;
