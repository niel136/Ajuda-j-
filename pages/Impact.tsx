
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, TrendingUp, Users, Zap, Globe, Sparkles } from 'lucide-react';
import MascotAvatar from '../components/MascotAvatar';

const Impact: React.FC = () => {
  const { globalImpact, registerSolidarityAction, profile, user } = useApp();
  const [pulseActive, setPulseActive] = useState(false);
  const [displayStats, setDisplayStats] = useState(globalImpact);

  // Smooth local update for the heart click
  const handlePulse = async () => {
    setPulseActive(true);
    await registerSolidarityAction();
    setTimeout(() => setPulseActive(false), 300);
  };

  // Interpolate counters (simplified for this context)
  useEffect(() => {
    setDisplayStats(globalImpact);
  }, [globalImpact]);

  return (
    <div className="flex flex-col gap-8 pb-10 animate-app-in">
      {/* HEADER IMPACTO */}
      <section className="flex flex-col items-center text-center pt-4">
        <div className="bg-black text-[#E2F687] p-4 rounded-[2.5rem] mb-6 shadow-2xl shadow-black/20">
          <Globe size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-black tracking-tighter leading-none">
          O Poder da <br/><span className="text-gray-400">Solidariedade</span>
        </h1>
        <p className="text-gray-500 font-bold text-sm mt-4 px-6 leading-relaxed">
          Cada gesto seu reverbera em uma rede real de transformações.
        </p>
      </section>

      {/* O CORAÇÃO DA SOLIDARIEDADE (INTERATIVO) */}
      <section className="relative flex justify-center items-center py-10">
        {/* Background glow pulse */}
        <div className={`absolute w-64 h-64 bg-[#E2F687]/20 rounded-full blur-3xl transition-transform duration-500 ${pulseActive ? 'scale-150' : 'scale-100'}`}></div>
        
        <button 
          onClick={handlePulse}
          className={`relative z-10 w-48 h-48 bg-white rounded-[3rem] shadow-2xl border-4 border-black/5 flex flex-col items-center justify-center transition-all active:scale-90 active:bg-gray-50 group`}
        >
          <div className={`mb-2 text-red-500 transition-all duration-300 ${pulseActive ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
            <Heart size={64} fill="currentColor" strokeWidth={0} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Espalhar Amor</span>
          
          {/* Action indicator */}
          {pulseActive && (
             <div className="absolute -top-4 animate-bounce bg-black text-[#E2F687] text-[9px] font-black px-3 py-1 rounded-full uppercase">
               +1 Apoio
             </div>
          )}
        </button>

        {/* Global Pulse Badge */}
        <div className="absolute bottom-4 bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 border-4 border-[#F8FAF5] shadow-xl">
           <Zap size={14} className="text-[#E2F687] animate-pulse" fill="currentColor" />
           <span className="text-xs font-black tracking-tighter">
             {displayStats.solidarityPulse.toLocaleString()} <span className="text-gray-500">ações reais</span>
           </span>
        </div>
      </section>

      {/* GLOBAL METRICS GRID */}
      <div className="grid grid-cols-1 gap-4">
         <div className="bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#E2F687] mb-2">
                <TrendingUp size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Total Arrecadado</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tighter">R$ {displayStats.totalRaised.toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-gray-500 text-[10px] font-bold mt-4 leading-tight">
                Recursos destinados 100% diretamente para as famílias através de transferências seguras.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#E2F687]/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col gap-3">
               <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <Users size={20} />
               </div>
               <div>
                  <span className="text-2xl font-black text-black">{displayStats.familiesHelped}</span>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Famílias Alcançadas</p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col gap-3">
               <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <Heart size={20} />
               </div>
               <div>
                  <span className="text-2xl font-black text-black">{(profile?.donations_count || 0)}</span>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Suas Doações</p>
               </div>
            </div>
         </div>
      </div>

      {/* IMPACT HIGHLIGHTS / TIPS */}
      <section className="bg-[#E2F687]/30 border border-black/5 rounded-[2.5rem] p-6 flex items-start gap-4">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={20} className="text-black" />
         </div>
         <div>
            <h4 className="font-extrabold text-black text-sm">Dica de Impacto</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
              Pedidos na categoria <b>Alimentação</b> costumam ser resolvidos 3x mais rápido. Priorize as urgências de hoje!
            </p>
         </div>
      </section>

      {/* FOOTER STATS */}
      <div className="text-center mt-6">
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          Transparência Total em Tempo Real
        </span>
      </div>
    </div>
  );
};

export default Impact;
