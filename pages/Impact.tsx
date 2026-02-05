
import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Users, Zap, Globe, Sparkles, Heart } from 'lucide-react';

const Impact: React.FC = () => {
  const { globalImpact, profile } = useApp();

  return (
    <div className="flex flex-col gap-8 pb-10 animate-app-in">
      {/* HEADER IMPACTO */}
      <section className="flex flex-col items-center text-center pt-4">
        <div className="bg-black text-[#E2F687] p-5 rounded-[2.5rem] mb-6 shadow-2xl shadow-black/20">
          <Globe size={36} />
        </div>
        <h1 className="text-4xl font-extrabold text-black tracking-tighter leading-none">
          Transparência <br/><span className="text-gray-400">em Real-Time</span>
        </h1>
        <p className="text-gray-500 font-bold text-sm mt-4 px-6 leading-relaxed">
          O impacto do AjudaJá é medido em vidas transformadas, não em cliques.
        </p>
      </section>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-4">
         <div className="bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#E2F687] mb-2">
                <TrendingUp size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Total Solidário</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tighter">R$ {globalImpact.totalRaised.toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-gray-500 text-[10px] font-bold mt-4 leading-tight uppercase tracking-widest">
                Transferidos diretamente para famílias
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
               <Heart size={180} fill="white" />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col gap-3">
               <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <Users size={20} />
               </div>
               <div>
                  <span className="text-2xl font-black text-black">{globalImpact.familiesHelped}</span>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 leading-none">Vidas <br/>Impactadas</p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col gap-3">
               <div className="w-10 h-10 bg-[#E2F687] text-black rounded-xl flex items-center justify-center">
                  <Zap size={20} />
               </div>
               <div>
                  <span className="text-2xl font-black text-black">{globalImpact.totalActions}</span>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 leading-none">Ações de <br/>Solidariedade</p>
               </div>
            </div>
         </div>
      </div>

      {/* PERSONAL CONTRIBUTION SECTION */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-black tracking-tighter">Sua Parte no Impacto</h3>
            <div className="bg-black text-[#E2F687] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Ativo</div>
         </div>
         <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-black/5">
               <span className="text-xs font-bold text-gray-500">Doações realizadas</span>
               <span className="text-sm font-black text-black">{profile?.donations_count || 0}</span>
            </div>
            <div className="flex justify-between items-center py-3">
               <span className="text-xs font-bold text-gray-500">Valor total doado</span>
               <span className="text-sm font-black text-black">R$ {(profile?.total_donated || 0).toLocaleString('pt-BR')}</span>
            </div>
         </div>
      </section>

      {/* IMPACT HIGHLIGHTS */}
      <section className="bg-gray-100/50 border border-black/5 rounded-[2.5rem] p-6 flex items-start gap-4">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-yellow-500">
            <Sparkles size={20} />
         </div>
         <div>
            <h4 className="font-extrabold text-black text-sm">Objetivo da Rede</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
              Nossa rede foca na urgência. 90% dos pedidos de alimentação são atendidos em menos de 48h graças a doadores como você.
            </p>
         </div>
      </section>

      <div className="text-center mt-6">
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          Powered by Solidariedade Real
        </span>
      </div>
    </div>
  );
};

export default Impact;
