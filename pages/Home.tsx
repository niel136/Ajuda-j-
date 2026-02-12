
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, PlusCircle, Settings, Zap, Users, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';
import MascotAvatar from '../components/MascotAvatar';

const Home: React.FC = () => {
  const { user, profile, requests } = useApp();
  
  const firstName = profile?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Visitante';

  return (
    <div className="flex flex-col gap-6 pb-10 animate-app-in w-full">
      {/* HEADER */}
      <section className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <Link to="/perfil" className="block active:scale-90 transition-transform">
            <MascotAvatar 
              seed={profile?.avatar_seed || user?.id || 'anon'} 
              size={48} 
              className="border-2 border-white shadow-sm rounded-2xl"
            />
          </Link>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#111111]/30 block">Dashboard</span>
            <h2 className="text-lg font-extrabold text-[#111111] tracking-tight leading-none truncate max-w-[150px]">Olá, {firstName}</h2>
          </div>
        </div>
        <Link to="/perfil/editar" className="w-11 h-11 rounded-2xl bg-white border border-[#111111]/5 flex items-center justify-center text-[#111111] active:scale-90 transition-all shadow-sm">
          <Settings size={18} />
        </Link>
      </section>

      {/* MAIN IMPACT CARD */}
      <div className="bg-[#111111] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl w-full">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#C6F64E] mb-4">
            <Zap size={12} fill="currentColor" />
            <span className="text-[9px] font-black uppercase tracking-widest">Impacto na Rede</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Movimentado</span>
            <span className="text-3xl font-black tracking-tighter">R$ {(profile?.total_donated || 0).toLocaleString('pt-BR')}</span>
          </div>
          
          <div className="mt-6 flex gap-6">
            <div className="flex flex-col">
              <span className="text-lg font-black">{profile?.donations_count || 0}</span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Ações Reais</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black">{requests?.length || 0}</span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Aguardando</span>
            </div>
          </div>
        </div>
        {/* Background Accent */}
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
            <div className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-active:scale-90 transition-all border border-[#111111]/5`}>
              <item.icon size={20} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-[#111111]/40 text-center">{item.label}</span>
          </Link>
        ))}
      </section>

      {/* FEED PREVIEW */}
      <section className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-[#111111] tracking-tighter">Urgências Agora</h3>
          <Link to="/feed" className="text-[9px] font-black text-[#111111]/30 uppercase tracking-widest border-b border-[#111111]/10 pb-0.5">Ver tudo</Link>
        </div>
        <div className="flex flex-col gap-4">
          {(requests || []).slice(0, 3).map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
          {(!requests || requests.length === 0) && (
            <div className="bg-white rounded-[2rem] p-10 text-center border border-dashed border-[#111111]/10">
              <p className="text-[#111111]/20 font-black uppercase text-[9px] tracking-widest">Aguardando sinais...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
