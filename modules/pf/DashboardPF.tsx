
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, PlusCircle, Settings, Zap, Users, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import RequestCard from '../../components/RequestCard';
import MascotAvatar from '../../components/MascotAvatar';
import LoadingScreen from '../../components/LoadingScreen';

const DashboardPF: React.FC = () => {
  const { user, profile, requests, isLoading } = useApp();
  
  if (isLoading) return <LoadingScreen />;

  // Force protection
  if (profile?.tipo_usuario !== 'PF') {
    return <Navigate to="/dashboard/pj" replace />;
  }

  const firstName = profile?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Visitante';

  return (
    <div className="flex flex-col gap-6 pb-24 animate-app-in w-full max-w-[500px] mx-auto px-5">
      {/* HEADER */}
      <section className="flex justify-between items-center w-full pt-8">
        <div className="flex items-center gap-3">
          <MascotAvatar 
            seed={profile?.avatar_seed || user?.id || 'anon'} 
            size={48} 
            className="border-2 border-white shadow-sm rounded-2xl"
          />
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Olá, doador</span>
            <h2 className="text-lg font-extrabold text-[#111111] tracking-tight leading-none truncate">{firstName}</h2>
          </div>
        </div>
        <Link to="/perfil/editar" className="w-11 h-11 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-[#111111] shadow-sm">
          <Settings size={18} />
        </Link>
      </section>

      {/* IMPACT CARD */}
      <div className="bg-[#111111] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#C6F64E] mb-4">
            <Zap size={12} fill="currentColor" />
            <span className="text-[9px] font-black uppercase tracking-widest">Impacto Social</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Total doado na rede</span>
            <span className="text-3xl font-black tracking-tighter">R$ {(profile?.total_donated || 0).toLocaleString('pt-BR')}</span>
          </div>
          <div className="mt-6 flex gap-6">
            <div className="flex flex-col">
              <span className="text-lg font-black">{profile?.donations_count || 0}</span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Vidas Impactadas</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6F64E]/10 rounded-full blur-[50px] -mr-16 -mt-16"></div>
      </div>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-4 gap-2 w-full">
        {[
          { icon: PlusCircle, label: 'Pedir', color: 'bg-[#C6F64E] text-[#111111]', to: '/novo-pedido' },
          { icon: Heart, label: 'Ajudar', color: 'bg-white text-[#111111]', to: '/feed' },
          { icon: Users, label: 'Amigos', color: 'bg-white text-[#111111]', to: '/convidar' },
          { icon: ShieldCheck, label: 'Impacto', color: 'bg-white text-[#111111]', to: '/impacto' }
        ].map((item, i) => (
          <Link key={i} to={item.to} className="flex flex-col items-center gap-2 group">
            <div className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-active:scale-90 transition-all border border-black/5`}>
              <item.icon size={20} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 text-center">{item.label}</span>
          </Link>
        ))}
      </section>

      {/* URGENCY FEED */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-[#111111] tracking-tighter">Urgências Críticas</h3>
          <Link to="/feed" className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ver tudo</Link>
        </div>
        <div className="flex flex-col gap-4">
          {(requests || []).slice(0, 3).map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPF;
