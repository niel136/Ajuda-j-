
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';
import LoadingScreen from '../components/LoadingScreen';
import { 
  Bell, Shield, LogOut, ChevronRight, Settings, 
  History, Heart, CreditCard, Share2, User as UserIcon,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
  const { user, profile, logout, refreshProfile } = useApp();
  const { permission, requestPermission } = useNotification();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efeito para garantir que o perfil exista ou seja criado
  useEffect(() => {
    const ensureProfileExists = async () => {
      if (!user?.id) return;
      
      // Se já temos o perfil carregado no context, não precisamos fazer nada
      if (profile) return;

      setIsSyncing(true);
      try {
        // Tenta buscar diretamente do Supabase para ter certeza
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // Registro não existe - Criar perfil padrão automaticamente
          console.log("Perfil não encontrado, criando registro inicial...");
          const { error: insertError } = await supabase.from('profiles').insert([{
            id: user.id,
            nome: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            tipo_conta: 'donor',
            quer: 'ajudar'
          }]);

          if (insertError) throw insertError;
          await refreshProfile();
        } else if (fetchError) {
          throw fetchError;
        }
      } catch (err: any) {
        console.error("Erro ao sincronizar perfil:", err);
        setError("Não foi possível carregar seus dados. Tente novamente.");
      } finally {
        setIsSyncing(false);
      }
    };

    ensureProfileExists();
  }, [user, profile, refreshProfile]);

  // Se não houver usuário logado (auth), redireciona
  if (!user) {
    navigate('/login', { replace: true });
    return <LoadingScreen />;
  }

  // Se estiver sincronizando o perfil inicial
  if (isSyncing) return <LoadingScreen />;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/onboarding', { replace: true });
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  // Funções seguras de acesso a dados com Fallbacks
  const getDisplayName = () => profile?.nome || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário';
  const getAvatar = () => profile?.avatar_url || user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
  
  const getRoleLabel = () => {
    const role = profile?.tipo_conta || 'donor';
    const labels: Record<string, string> = {
      'donor': 'Doador Ativo',
      'beneficiary': 'Beneficiário',
      'business': 'Instituição',
      'admin': 'Administrador'
    };
    return labels[role] || 'Voluntário';
  };

  // Fallbacks para estatísticas (nunca deixa quebrar)
  const stats = {
    donations: profile?.donations_count || 0,
    total: profile?.total_donated || 0
  };

  return (
    <div className="flex flex-col gap-8 pb-10 animate-app-in">
      {/* MENSAGEM DE ERRO (CASO EXISTA) */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-3xl flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
        </div>
      )}

      {/* HEADER DO PERFIL */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative">
            <div className="w-32 h-32 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-gray-100 flex items-center justify-center">
                {getAvatar() ? (
                  <img 
                    src={getAvatar()} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + getDisplayName())}
                  />
                ) : (
                  <UserIcon size={48} className="text-gray-300" />
                )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-[#E2F687] shadow-xl border-4 border-[#F8FAF5]">
                <Settings size={18} />
            </div>
        </div>
        
        <div className="text-center mt-6">
          <h1 className="text-3xl font-extrabold text-black tracking-tighter truncate max-w-[280px]">
            {getDisplayName()}
          </h1>
          <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-black text-[#E2F687] text-[10px] font-black rounded-full uppercase tracking-widest">
            {getRoleLabel()}
          </div>
        </div>
      </section>

      {/* DASHBOARD DE IMPACTO SEGURO */}
      <div className="grid grid-cols-2 gap-4 px-1">
         <div className="bg-white p-5 rounded-[2rem] border border-black/5 flex flex-col gap-2 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ajudas Realizadas</span>
            <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold text-black">{stats.donations}</span>
                <Heart size={16} className="text-red-500 mb-1" fill="currentColor" />
            </div>
         </div>
         <div className="bg-white p-5 rounded-[2rem] border border-black/5 flex flex-col gap-2 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Doado</span>
            <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold text-black">R$ {stats.total.toLocaleString('pt-BR')}</span>
            </div>
         </div>
      </div>

      {/* MENU DE OPÇÕES */}
      <div className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-black/5 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Configurações</h3>
        </div>
        
        <div className="flex flex-col">
            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-all border-b border-black/5 group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><History size={20} /></div>
                    <span className="font-bold text-gray-900 group-active:translate-x-1 transition-transform">Meu Histórico</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-all border-b border-black/5 group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center"><CreditCard size={20} /></div>
                    <span className="font-bold text-gray-900 group-active:translate-x-1 transition-transform">Formas de Doação</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button className="flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center"><Share2 size={20} /></div>
                    <span className="font-bold text-gray-900 group-active:translate-x-1 transition-transform">Convidar Amigos</span>
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
                <span className="font-bold text-gray-900 block leading-tight">Alertas Urgentes</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{permission === 'granted' ? 'Ativados' : 'Desativados'}</span>
            </div>
        </div>
        {permission !== 'granted' ? (
            <Button size="sm" variant="black" className="h-10 px-4 rounded-xl" onClick={requestPermission}>Ativar</Button>
        ) : (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Shield size={16} fill="currentColor" />
            </div>
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
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">AjudaJá • v2.1.0</span>
      </div>
    </div>
  );
};

export default Profile;
