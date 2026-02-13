
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { 
  Check, X, Info, AlertTriangle, ShieldCheck, 
  Users, Building2, TrendingUp, DollarSign, 
  Activity, Search, Filter, Lock, Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import LoadingScreen from '../components/LoadingScreen';

const Admin: React.FC = () => {
  const { profile, requests, moderateRequest, verifyUser, globalImpact } = useApp();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [tab, setTab] = useState<'requests' | 'users' | 'stats'>('stats');

  useEffect(() => {
    if (tab === 'users') fetchUsers();
  }, [tab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setAllUsers(data);
    setLoadingUsers(false);
  };

  if (profile?.tipo_usuario !== 'ADM' && profile?.tipo_conta !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6">
           <Lock size={40} />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tighter">Acesso Restrito</h1>
        <p className="text-gray-500 font-bold text-sm mt-2">Somente administradores podem acessar esta área.</p>
        <Button variant="outline" className="mt-8 border-white/10 text-white" onClick={() => window.location.href = '/'}>Voltar para Home</Button>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'EM_ANALISE' || r.status === 'EM_ANALISE_CRITICA');
  const pfCount = allUsers.filter(u => u.tipo_usuario === 'PF').length;
  const pjCount = allUsers.filter(u => u.tipo_usuario === 'PJ').length;

  return (
    <div className="animate-app-in min-h-screen bg-[#0B0F19] -mx-5 -my-4 px-6 pt-10 pb-20 text-white">
      {/* HEADER ADM */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Admin <span className="text-[#C6F64E]">Center</span></h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-[#C6F64E] rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Real-time Monitor</span>
          </div>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl">
          <Activity className="text-[#C6F64E]" size={20} />
        </div>
      </header>

      {/* TABS */}
      <nav className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-10 overflow-x-auto no-scrollbar">
        {[
          { id: 'stats', label: 'Dashboard', icon: TrendingUp },
          { id: 'requests', label: 'Moderação', icon: ShieldCheck },
          { id: 'users', label: 'Usuários', icon: Users }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-[#C6F64E] text-black' : 'text-white/40 hover:text-white'}`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </nav>

      {/* DASHBOARD STATS */}
      {tab === 'stats' && (
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                 <DollarSign className="text-green-500 mb-4" size={24} />
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Receita Bruta</p>
                 <h4 className="text-3xl font-black">R$ {(globalImpact.totalRaised * 0.08).toLocaleString('pt-BR')}</h4>
              </div>
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                 <Activity className="text-indigo-500 mb-4" size={24} />
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Ações Ativas</p>
                 <h4 className="text-3xl font-black">{globalImpact.totalActions}</h4>
              </div>
           </div>

           <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
              <div className="flex justify-between items-center mb-6">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Distribuição de Contas</p>
                 <Users size={16} className="text-white/20" />
              </div>
              <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                     <div className="h-4 bg-blue-500 rounded-full w-full"></div>
                     <span className="text-[9px] font-black uppercase">PF: 68%</span>
                  </div>
                  <div className="flex-1 space-y-2">
                     <div className="h-4 bg-indigo-600 rounded-full w-1/3"></div>
                     <span className="text-[9px] font-black uppercase">PJ: 32%</span>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* MODERATION LIST */}
      {tab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-white/20 font-black uppercase text-xs">Fila de pedidos vazia</p>
            </div>
          ) : (
            pendingRequests.map(req => (
              <div key={req.id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6 animate-app-in">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight">IA Score: {req.score_confianca_ia}%</span>
                    </div>
                    <h3 className="font-black text-white text-xl leading-tight">{req.titulo}</h3>
                    <p className="text-xs text-white/40 font-bold mt-1">Por: {req.profiles?.nome} | Meta: R$ {req.valor_meta}</p>
                  </div>
                </div>
                
                <p className="text-xs text-white/50 bg-white/5 p-4 rounded-2xl italic leading-relaxed">"{req.descricao}"</p>
                
                <div className="grid grid-cols-3 gap-2">
                  <button className="h-14 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10" onClick={() => moderateRequest(req.id, 'INFO')}>Info</button>
                  <button className="h-14 bg-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest" onClick={() => moderateRequest(req.id, 'NEGAR')}>Negar</button>
                  <button className="h-14 bg-[#C6F64E] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest" onClick={() => moderateRequest(req.id, 'APROVAR')}>Aprovar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* USERS LIST */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input placeholder="Buscar usuários ou CNPJ..." className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 font-bold text-sm outline-none focus:ring-2 focus:ring-[#C6F64E]" />
          </div>

          <div className="space-y-3">
             {loadingUsers ? <LoadingScreen /> : allUsers.map(u => (
               <div key={u.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center group">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${u.tipo_usuario === 'PJ' ? 'bg-indigo-600 text-white' : 'bg-blue-500 text-white'}`}>
                      {u.tipo_usuario}
                    </div>
                    <div>
                      <p className="font-black text-white text-sm">{u.nome}</p>
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{u.status_verificacao} • {u.cnpj || 'Sem CNPJ'}</span>
                    </div>
                 </div>
                 
                 <div className="flex gap-2">
                    {u.status_verificacao === 'PENDENTE' && (
                      <button onClick={() => verifyUser(u.id, 'VERIFICADO')} className="w-10 h-10 bg-[#C6F64E] text-black rounded-xl flex items-center justify-center hover:scale-105 transition-transform"><Check size={18} /></button>
                    )}
                    <button className="w-10 h-10 bg-white/5 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
