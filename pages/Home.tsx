
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
    <div className="flex flex-col gap-8 pb-10 animate-app-in">
      {/* HEADER */}
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/perfil" className="block active:scale-90 transition-transform">
            <MascotAvatar 
              seed={profile?.avatar_seed || user?.id || 'anon'} 
              size={52} 
              className="border-2 border-white shadow-sm rounded-2xl"
            />
          </Link>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#111111]/30 block">Dashboard</span>
            <h2 className="text-xl font-extrabold text-[#111111] tracking-tight leading-none truncate">Olá, {firstName}</h2>
          </div>
        </div>
        <Link to="/perfil/editar" className="w-12 h-12 rounded-2xl bg-white border border-[#111111]/5 flex items-center justify-center text-[#111111] active:scale-90 transition-all shadow-sm">
          <Settings size={20} />
        </Link>
      </section>

      {/* MAIN IMPACT CARD */}
      <div className="bg-[#111111] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#C6F64E] mb-6">
            <Zap size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">Impacto na Rede</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Movimentado</span>
            <span className="text-4xl font-black tracking-tighter">R$ {(profile?.total_donated || 0).toLocaleString('pt-BR')}</span>
          </div>
          
          <div className="mt-8 flex gap-8">
            <div className="flex flex-col">
              <span className="text-xl font-black">{profile?.donations_count || 0}</span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Ações Reais</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black">{requests?.length || 0}</span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Aguardando</span>
            </div>
          </div>
        </div>
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#C6F64E]/10 rounded-full blur-[60px] -mr-20 -mt-20"></div>
      </div>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-4 gap-4 px-2">
        {[
          { icon: PlusCircle, label: 'Pedir', color: 'bg-[#C6F64E] text-[#111111]', to: '/novo-pedido' },
          { icon: Heart, label: 'Ajudar', color: 'bg-white text-[#111111]', to: '/feed' },
          { icon: Users, label: 'Amigos', color: 'bg-white text-[#111111]', to: '/convidar' },
          { icon: ShieldCheck, label: 'Impacto', color: 'bg-white text-[#111111]', to: '/impacto' }
        ].map((item, i) => (
          <Link key={i} to={item.to} className="flex flex-col items-center gap-2 group">
            <div className={`${item.color} w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-active:scale-90 transition-all border border-[#111111]/5`}>
              <item.icon size={22} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#111111]/40">{item.label}</span>
          </Link>
        ))}
      </section>

      {/* FEED PREVIEW */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-lg font-black text-[#111111] tracking-tighter">Urgências Agora</h3>
          <Link to="/feed" className="text-[10px] font-black text-[#111111]/30 uppercase tracking-widest border-b border-[#111111]/10 pb-1">Ver tudo</Link>
        </div>
        <div className="flex flex-col gap-4">
          {(requests || []).slice(0, 3).map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
          {(!requests || requests.length === 0) && (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-[#111111]/10">
              <p className="text-[#111111]/20 font-black uppercase text-[10px] tracking-widest">Aguardando sinais...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
