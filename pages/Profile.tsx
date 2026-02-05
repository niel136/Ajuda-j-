
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';
import MascotAvatar from '../components/MascotAvatar';
import { 
  Bell, Shield, LogOut, ChevronRight, Settings, 
  History, Heart, CreditCard, Share2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
  const { user, profile, logout, refreshProfile } = useApp();
  const { permission, requestPermission } = useNotification();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const checkAndCreateProfile = async () => {
      if (!user?.id || profile) return;

      setIsInitializing(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          const defaultName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
          const defaultRole = localStorage.getItem('ajudaJa_pending_role') || 'donor';
          const randomSeed = Math.random().toString(36).substring(7);
          
          await supabase.from('profiles').insert([{
            id: user.id,
            nome: defaultName,
            tipo_conta: defaultRole,
            avatar_seed: randomSeed,
            quer: defaultRole === 'donor' ? 'ajudar' : 'pedir_ajuda',
            donations_count: 0,
            total_donated: 0
          }]);
          
          await refreshProfile();
        }
      } catch (err) {
        console.warn("Silent profile check failed", err);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAndCreateProfile();
  }, [user, profile, refreshProfile]);

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/onboarding', { replace: true });
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  const displayName = profile?.nome || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
  const roleLabel = () => {
    const role = profile?.tipo_conta || 'donor';
    const map: Record<string, string> = {
      donor: 'Doador Ativo',
      beneficiary: 'Beneficiário',
      business: 'Empresa',
      admin: 'Admin'
    };
    return map[role] || 'Voluntário';
  };

  const stats = {
    donations: profile?.donations_count || 0,
    total: profile?.total_donated || 0
  };

  return (
    <div className="flex flex-col gap-8 pb-10 animate-app-in">
      {/* HEADER DO PERFIL COM MASCOTE DINÂMICO */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative group">
            <MascotAvatar 
              seed={profile?.avatar_seed || user.id} 
              size={140} 
              className={`border-4 border-white shadow-2xl transition-all group-active:scale-95`} 
            />
            <Link 
              to="/perfil/editar"
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-black text-[#E2F687] rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#F8FAF5] active:scale-90 transition-transform btn-active"
            >
                <Settings size={20} />
            </Link>
        </div>
        
        <div className="text-center mt-6">
          <h1 className="text-3xl font-extrabold text-black tracking-tighter truncate max-w-[280px]">
            {displayName}
          </h1>
          <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-black text-[#E2F687] text-[10px] font-black rounded-full uppercase tracking-widest">
            {roleLabel()}
          </div>
        </div>
      </section>

      {/* DASHBOARD DE IMPACTO */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-6 rounded-[2rem] border border-black/5 flex flex-col gap-2 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</span>
            <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold text-black">{stats.donations}</span>
                <Heart size={16} className="text-red-500 mb-1" fill="currentColor" />
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-black/5 flex flex-col gap-2 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Impacto</span>
            <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold text-black">R$ {stats.total}</span>
            </div>
         </div>
      </div>

      {/* MENU DE OPÇÕES */}
      <div className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-black/5 flex items-center justify-between bg-gray-50/30">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Privacidade e Conta</h3>
        </div>
        
        <div className="flex flex-col">
            <Link to="/perfil/editar" className="flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-all border-b border-black/5 group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Settings size={20} /></div>
                    <span className="font-bold text-gray-900">Configurações do Perfil</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </Link>

            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-all border-b border-black/5 group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><History size={20} /></div>
                    <span className="font-bold text-gray-900">Meu Histórico</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-all border-b border-black/5 group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center"><CreditCard size={20} /></div>
                    <span className="font-bold text-gray-900">Pagamentos</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center"><Share2 size={20} /></div>
                    <span className="font-bold text-gray-900">Convidar Amigos</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>
        </div>
      </div>

      {/* NOTIFICAÇÕES */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 ${permission === 'granted' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-500'} rounded-xl flex items-center justify-center transition-colors`}>
              <Bell size={20} />
            </div>
            <div>
                <span className="font-bold text-gray-900 block leading-tight">Notificações</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{permission === 'granted' ? 'Ativadas' : 'Ativar Alertas'}</span>
            </div>
        </div>
        {permission !== 'granted' && (
            <Button size="sm" variant="black" className="h-10 px-4 rounded-xl" onClick={requestPermission}>Ativar</Button>
        )}
      </div>

      {/* BOTÃO DE SAÍDA */}
      <div className="px-2 mt-4">
        <Button 
          variant="outline" 
          fullWidth 
          className="text-red-500 border-red-100 bg-red-50/30 hover:bg-red-50 h-16 rounded-[2rem]" 
          onClick={handleLogout}
        >
            <LogOut size={18} className="mr-2" /> Encerrar Sessão
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">AjudaJá • v2.3.0</span>
      </div>
    </div>
  );
};

export default Profile;
