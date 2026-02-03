import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, PlusCircle, Settings, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';

const Home: React.FC = () => {
  const { user, requests } = useApp();
  const firstName = user?.name.split(' ')[0] || 'Visitante';

  return (
    <div className="flex flex-col gap-8 pb-10">
      <section className="flex justify-between items-center px-1">
        <div className="flex items-center gap-4">
          <Link to="/perfil" className="w-12 h-12 rounded-2xl overflow-hidden border border-black/5">
            <img src={user?.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-black tracking-tight leading-none">Olá, {firstName}</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1 inline-block">
              {user?.role === 'donor' ? 'Doador Ativo' : 'Comunidade'}
            </span>
          </div>
        </div>
        <Link to="/perfil" className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-gray-400">
          <Settings size={20} />
        </Link>
      </section>

      <section>
        <div className="bg-[#E2F687]/40 rounded-[2rem] p-5 flex items-center gap-4 border border-black/5">
          <div className="w-16 h-16 shrink-0 bg-white/60 rounded-xl p-2 flex items-center justify-center overflow-hidden">
             <img src="https://i.postimg.cc/15FXPBTV/20260202-061509.png" alt="M" className="w-full h-auto" />
          </div>
          <p className="text-xs font-bold text-black leading-tight">
            "Sua pequena doação hoje pode ser o recomeço de uma família."
          </p>
        </div>
      </section>

      <div className="bg-black rounded-[2rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#E2F687] mb-6">
            <TrendingUp size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Seu Impacto</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">R$ {user?.stats.totalDonated || 0}</span>
          </div>
          <div className="mt-8 flex gap-8">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold">{user?.stats.donationsCount || 0}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase">Doações</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold">{user?.stats.requestsCreated || 0}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase">Pedidos</span>
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4">
        <Link to="/novo-pedido" className="bg-white p-6 rounded-[2rem] border border-black/5 flex flex-col justify-between h-40 group shadow-sm">
          <div className="w-12 h-12 bg-black text-[#E2F687] rounded-xl flex items-center justify-center">
            <PlusCircle size={24} />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-lg font-extrabold text-black leading-tight tracking-tight">Pedir<br/>ajuda</span>
            <ArrowUpRight size={18} className="text-gray-300" />
          </div>
        </Link>

        <Link to="/feed" className="bg-white p-6 rounded-[2rem] border border-black/5 flex flex-col justify-between h-40 group shadow-sm">
          <div className="w-12 h-12 bg-[#E2F687] text-black rounded-xl flex items-center justify-center">
            <Heart size={24} />
          </div>
          <div className="flex justify-between items-end">
            <span className="text-lg font-extrabold text-black leading-tight tracking-tight">Quero<br/>ajudar</span>
            <ArrowUpRight size={18} className="text-gray-300" />
          </div>
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-extrabold text-black tracking-tight">Pedidos Recentes</h3>
          <Link to="/feed" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ver todos</Link>
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