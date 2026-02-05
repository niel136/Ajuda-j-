
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, PlusCircle, Settings, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';
import MascotAvatar from '../components/MascotAvatar';

const Home: React.FC = () => {
  const { user, profile, requests } = useApp();
  
  const firstName = profile?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';
  const roleLabel = profile?.tipo_conta === 'donor' ? 'Doador Ativo' : 'Comunidade';

  return (
    <div className="flex flex-col gap-8 pb-10 animate-app-in">
      {/* Header amigável */}
      <section className="flex justify-between items-center px-1">
        <div className="flex items-center gap-4">
          <Link to="/perfil" className="block active:scale-95 transition-transform">
            <MascotAvatar 
              seed={profile?.avatar_seed || user?.id || 'anon'} 
              size={56} 
              className="border-2 border-white shadow-md rounded-2xl"
            />
          </Link>
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold text-black tracking-tight leading-none truncate max-w-[180px]">Olá, {firstName}</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1 inline-block">
              {roleLabel}
            </span>
          </div>
        </div>
        <Link to="/perfil/editar" className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-gray-400 active:scale-90 transition-transform btn-active">
          <Settings size={20} />
        </Link>
      </section>

      {/* Card de Mensagem do Dia */}
      <section>
        <div className="bg-[#E2F687]/40 rounded-[2rem] p-5 flex items-center gap-4 border border-black/5 shadow-sm">
          <div className="w-16 h-16 shrink-0 bg-white/60 rounded-xl p-2 flex items-center justify-center overflow-hidden">
             <img src="https://i.postimg.cc/15FXPBTV/20260202-061509.png" alt="M" className="w-full h-auto" />
          </div>
          <p className="text-xs font-bold text-black leading-tight">
            "Sua pequena doação hoje pode ser o recomeço de uma família."
          </p>
        </div>
      </section>

      {/* Dashboard de Estatísticas */}
      <div className="bg-black rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#E2F687] mb-6">
            <TrendingUp size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Impacto Gerado</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">R$ {(profile?.total_donated || 0).toLocaleString('pt-BR')}</span>
          </div>
          <div className="mt-8 flex gap-8">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold">{profile?.donations_count || 0}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Ações</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold">{requests.length}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Pedidos Ativos</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2F687]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </div>

      {/* Atalhos Rápidos */}
      <section className="grid grid-cols-2 gap-4">
        <Link to="/novo-pedido" className="bg-white p-6 rounded-[2rem] border border-black/5 flex flex-col justify-between h-40 group shadow-sm active:scale-95 transition-all">
          <div className="w-12 h-12 bg-black text-[#E2F687] rounded-xl flex items-center justify-center">
            <PlusCircle size={24} />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-lg font-extrabold text-black leading-tight tracking-tight">Pedir<br/>ajuda</span>
            <ArrowUpRight size={18} className="text-gray-300" />
          </div>
        </Link>

        <Link to="/feed" className="bg-white p-6 rounded-[2rem] border border-black/5 flex flex-col justify-between h-40 group shadow-sm active:scale-95 transition-all">
          <div className="w-12 h-12 bg-[#E2F687] text-black rounded-xl flex items-center justify-center">
            <Heart size={24} />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-lg font-extrabold text-black leading-tight tracking-tight">Quero<br/>ajudar</span>
            <ArrowUpRight size={18} className="text-gray-300" />
          </div>
        </Link>
      </section>

      {/* Feed Rápido */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-extrabold text-black tracking-tight">Urgências Próximas</h3>
          <Link to="/feed" className="text-[10px] font-black text-gray-400 uppercase tracking-widest underline underline-offset-4">Ver todos</Link>
        </div>
        <div className="flex flex-col gap-4">
          {requests.slice(0, 2).map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
          {requests.length === 0 && (
            <div className="bg-white border border-dashed border-black/5 rounded-[2rem] p-10 text-center">
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Nenhum pedido aberto</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
