
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Users, Zap, Globe, Sparkles, Heart, ChevronRight } from 'lucide-react';

const Impact: React.FC = () => {
  const { globalImpact, profile } = useApp();
  const [filter, setFilter] = useState('Mensal');

  return (
    <div className="flex flex-col gap-10 pb-10 animate-app-in">
      {/* FILTROS PILL */}
      <section className="flex justify-center gap-2 overflow-x-auto no-scrollbar py-2">
        {['Hoje', 'Semana', 'Mensal', 'Anual'].map((p) => (
          <button 
            key={p} 
            onClick={() => setFilter(p)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === p ? 'bg-[#111111] text-[#C6F64E]' : 'bg-white text-[#111111]/30 border border-[#111111]/5'}`}
          >
            {p}
          </button>
        ))}
      </section>

      {/* STATS HEADER */}
      <section className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-[#C6F64E] rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-[#C6F64E]/20">
          <TrendingUp size={28} className="text-[#111111]" />
        </div>
        <h1 className="text-4xl font-black text-[#111111] tracking-tighter leading-none mb-4">
          Seu Impacto <br/><span className="text-[#111111]/30">na Sociedade</span>
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="px-4 py-1.5 bg-[#111111] text-white rounded-full text-[10px] font-black uppercase tracking-widest">
            Nível: Embaixador
          </div>
        </div>
      </section>

      {/* BIG NUMBER CARD */}
      <div className="bg-[#111111] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 block">Arrecadação Global</span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black tracking-tighter">R$ {globalImpact.totalRaised.toLocaleString('pt-BR')}</span>
          <span className="text-[#C6F64E] text-sm font-black">+12%</span>
        </div>
        
        {/* Simple Minimal Bar Chart */}
        <div className="flex items-end gap-2 h-20 mt-10">
          {[40, 70, 45, 90, 60, 80, 50, 95].map((h, i) => (
            <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-[#C6F64E] rounded-t-lg transition-all duration-1000 group-hover:brightness-125" 
                style={{ height: `${h}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-8 rounded-[2rem] border border-[#111111]/5 shadow-sm flex flex-col gap-6">
          <div className="w-12 h-12 bg-[#F6F6F6] text-[#111111] rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <span className="text-3xl font-black text-[#111111]">{globalImpact.familiesHelped}</span>
            <p className="text-[9px] font-black text-[#111111]/30 uppercase tracking-widest mt-1">Famílias<br/>Apoiadas</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-[#111111]/5 shadow-sm flex flex-col gap-6">
          <div className="w-12 h-12 bg-[#C6F64E]/20 text-[#111111] rounded-2xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <span className="text-3xl font-black text-[#111111]">{globalImpact.totalActions}</span>
            <p className="text-[9px] font-black text-[#111111]/30 uppercase tracking-widest mt-1">Ações de<br/>Urgência</p>
          </div>
        </div>
      </div>

      {/* HIGHLIGHT SECTION */}
      <section className="bg-[#111111] text-white p-8 rounded-[2.5rem] flex items-center justify-between group active:scale-95 transition-all">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-[#C6F64E]">
            <Heart size={24} fill="currentColor" />
          </div>
          <div>
            <h4 className="font-black text-lg tracking-tight">Sua Contribuição</h4>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">R$ {(profile?.total_donated || 0).toLocaleString('pt-BR')} doados</p>
          </div>
        </div>
        <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
      </section>

      <div className="text-center">
        <span className="text-[10px] font-black text-[#111111]/10 uppercase tracking-[0.4em]">Fintech Social Premium</span>
      </div>
    </div>
  );
};

export default Impact;
