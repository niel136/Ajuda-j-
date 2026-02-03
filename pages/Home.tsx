import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Target, Heart, PlusCircle, Settings, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';

const Home: React.FC = () => {
  const { user, requests } = useApp();
  const firstName = user?.name.split(' ')[0] || 'Visitante';

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Topo: Perfil */}
      <section className="flex justify-between items-center px-1 animate-app-in">
        <div className="flex items-center gap-4">
          <Link to="/perfil" className="w-14 h-14 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl">
            <img src={user?.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold text-black tracking-tighter leading-none">Olá, {firstName}</h2>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mt-2 inline-block">
              {user?.role === 'donor' ? 'Doador Ativo' : user?.role === 'beneficiary' ? 'Beneficiário' : 'Instituição Parceira'}
            </span>
          </div>
        </div>
        <Link to="/perfil" className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-gray-400 btn-active shadow-sm">
          <Settings size={22} />
        </Link>
      </section>

      {/* Card de Boas-vindas do Mascote */}
      <section className="animate-app-in" style={{ animationDelay: '0.05s' }}>
        <div className="bg-[#E2F687] rounded-[2.5rem] p-5 flex items-center gap-4 border border-black/5 shadow-sm">
          <div className="w-20 h-20 shrink-0 bg-white/50 rounded-2xl p-2 flex items-center justify-center overflow-hidden">
             <img 
               src="https://i.postimg.cc/15FXPBTV/20260202-061509.png" 
               alt="Mascote" 
               className="w-full h-auto object-contain scale-125"
             />
          </div>
          <div className="flex-1">
             <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={12} className="text-black/40" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Dica da Comunidade</span>
             </div>
             <p className="text-xs font-bold text-black leading-snug">
               "Cada pequena ação gera um grande impacto. Que tal ver quem precisa de ajuda hoje?"
             </p>
          </div>
        </div>
      </section>

      {/* Card de Impacto Principal */}
      <div className="bg-black rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden animate-app-in" style={{ animationDelay: '0.1s' }}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#E2F687] rounded-full blur-[90px] opacity-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#E2F687] mb-8">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Resumo de Impacto</span>
          </div>

          <p className="text-gray-500 text-sm font-bold mb-1">Impacto total gerado</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-extrabold tracking-tighter">R$ {user?.stats.totalDonated || 0}</span>
          </div>
          
          <div className="mt-10 flex items-center gap-8 border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold leading-none">{user?.stats.donationsCount || 0}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">Ajudas Realizadas</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold leading-none">{user?.stats.requestsCreated || 0}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">Pedidos Criados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Ações Principais */}
      <section className="grid grid-cols-2 gap-4 animate-app-in" style={{ animationDelay: '0.2s' }}>
        <Link to="/novo-pedido" className="bg-white p-7 rounded-[2.8rem] border border-black/5 flex flex-col justify-between h-48 btn-active shadow-sm group">
          <div className="w-14 h-14 bg-black text-[#E2F687] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-black/10">
            <PlusCircle size={32} />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xl font-extrabold text-black leading-tight tracking-tighter">Pedir<br/>ajuda</span>
            <ArrowUpRight size={22} className="text-gray-300" />
          </div>
        </Link>

        <Link to="/feed" className="bg-white p-7 rounded-[2.8rem] border border-black/5 flex flex-col justify-between h-48 btn-active shadow-sm group">
          <div className="w-14 h-14 bg-[#E2F687] text-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-[#E2F687]/20">
            <Heart size={32} />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xl font-extrabold text-black leading-tight tracking-tighter">Quero<br/>ajudar</span>
            <ArrowUpRight size={22} className="text-gray-300" />
          </div>
        </Link>
      </section>

      {/* Recentes */}
      <section className="flex flex-col gap-5 animate-app-in px-1" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-extrabold text-black tracking-tighter">Urgentes perto de você</h3>
          <Link to="/feed" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Ver todos</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          {requests.slice(0, 1).map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;