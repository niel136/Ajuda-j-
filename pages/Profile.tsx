
import React from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';
import { Bell, Shield, LogOut, ChevronRight, Settings, History, Heart, CreditCard, Share2 } from 'lucide-react';
// Corrected import for useNavigate
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useApp();
  const { permission, requestPermission } = useNotification();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/onboarding');
  };

  const getRoleLabel = () => {
    switch(user.role) {
        case 'donor': return 'Doador Ativo';
        case 'beneficiary': return 'Beneficiário';
        case 'business': return 'Instituição';
        case 'admin': return 'Administrador';
        default: return 'Voluntário';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER DO PERFIL */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative group">
            <img 
              src={user.avatarUrl || 'https://picsum.photos/150/150'} 
              alt={user.name} 
              className="w-32 h-32 rounded-[3rem] object-cover border-4 border-white shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-[#E2F687] shadow-xl border-4 border-[#F8FAF5]">
                <Settings size={18} />
            </div>
        </div>
        
        <div className="text-center mt-6">
          <h1 className="text-3xl font-extrabold text-black tracking-tighter">{user.name}</h1>
          <div className="inline-flex items-center gap-2 mt-1 px-4 py-1.5 bg-black text-[#E2F687] text-[10px] font-black rounded-full uppercase tracking-widest">
            {getRoleLabel()}
          </div>
        </div>
      </section>

      {/* DASHBOARD DE IMPACTO */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-5 rounded-[2rem] border border-black/5 flex flex-col gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ajudas Realizadas</span>
            <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold">{user.stats.donationsCount}</span>
                <Heart size={16} className="text-red-500 mb-1" fill="currentColor" />
            </div>
         </div>
         <div className="bg-white p-5 rounded-[2rem] border border-black/5 flex flex-col gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Doado</span>
            <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold text-black">R$ {user.stats.totalDonated}</span>
            </div>
         </div>
      </div>

      {/* MENU DE OPÇÕES - ESTILO IOS */}
      <div className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden">
        <div className="p-4 border-b border-black/5 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Minha Conta</h3>
        </div>
        
        <div className="flex flex-col">
            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><History size={20} /></div>
                    <span className="font-bold text-gray-900">Histórico de Atividade</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:scale-[0.98] transition-all border-t border-black/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center"><CreditCard size={20} /></div>
                    <span className="font-bold text-gray-900">Formas de Pagamento</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:scale-[0.98] transition-all border-t border-black/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center"><Share2 size={20} /></div>
                    <span className="font-bold text-gray-900">Convidar Amigos</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>
        </div>
      </div>

      {/* NOTIFICAÇÕES */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Bell size={20} /></div>
            <div>
                <span className="font-bold text-gray-900 block">Notificações</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{permission === 'granted' ? 'Ativadas' : 'Desativadas'}</span>
            </div>
        </div>
        {permission !== 'granted' && (
            <Button size="sm" variant="black" onClick={requestPermission}>Ativar</Button>
        )}
        {permission === 'granted' && (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Shield size={16} fill="currentColor" />
            </div>
        )}
      </div>

      <div className="px-2">
        <Button variant="outline" fullWidth className="text-red-500 border-red-100 hover:bg-red-50 h-14" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" /> Sair da Conta
        </Button>
      </div>
      
      <div className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest pb-10">
        AjudaJá App • v2.0.4 • 2024
      </div>
    </div>
  );
};

export default Profile;
