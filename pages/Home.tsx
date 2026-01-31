import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Zap, Target, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';

const Home: React.FC = () => {
  const { user, requests } = useApp();
  const firstName = user?.name.split(' ')[0] || 'Visitante';

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER DE BOAS VINDAS */}
      <section>
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 px-1">Seu painel</p>
                <h2 className="text-4xl font-extrabold text-black tracking-tighter">Olá, {firstName}!</h2>
            </div>
            <div className="bg-[#E2F687] text-black text-[10px] font-black px-3 py-1 rounded-full mb-1">PRO</div>
        </div>
      </section>

      {/* DASHBOARD CARD - CLEAN & BOLD */}
      <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#E2F687] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#E2F687] mb-6">
                <Target size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Sua Meta de Impacto</span>
            </div>

            <p className="text-gray-400 text-sm font-bold mb-1">Total doado à comunidade</p>
            <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tighter">R$ 1.250</span>
                <span className="text-2xl font-bold text-gray-600">,00</span>
            </div>
            
            <div className="mt-8 flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-xl font-extrabold">12</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Ajudados</span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="flex flex-col">
                    <span className="text-xl font-extrabold">85%</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Fidelidade</span>
                </div>
            </div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <section className="grid grid-cols-2 gap-3">
        <Link to="/impacto" className="bg-white p-5 rounded-[2rem] border border-black/[0.03] flex flex-col justify-between h-32 btn-active">
            <Users className="text-black" size={24} />
            <div className="flex justify-between items-end">
                <span className="text-sm font-extrabold leading-tight">Meus<br/>Amigos</span>
                <ArrowUpRight size={16} className="text-gray-300" />
            </div>
        </Link>
        <Link to="/feed" className="bg-white p-5 rounded-[2rem] border border-black/[0.03] flex flex-col justify-between h-32 btn-active">
            <Zap className="text-black" size={24} />
            <div className="flex justify-between items-end">
                <span className="text-sm font-extrabold leading-tight">Urgências<br/>Atuais</span>
                <ArrowUpRight size={16} className="text-gray-300" />
            </div>
        </Link>
      </section>

      {/* LISTA DE ATIVIDADES RECENTES */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-extrabold text-black tracking-tight">Perto de você</h3>
          <Link to="/feed" className="text-xs font-black text-gray-400 uppercase hover:text-black transition-colors">Ver Tudo</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          {requests.slice(0, 2).map(req => (
            <RequestCard key={req.id} request={req} minimal />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;