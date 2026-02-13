
import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, TrendingUp, ShieldCheck, Download, Users, Landmark, FileText, ChevronRight } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const DashboardPJ: React.FC = () => {
  const { profile, donations, fetchDonations, isLoading } = useApp();

  useEffect(() => {
    fetchDonations();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="animate-app-in pb-20 space-y-8">
      {/* HEADER CORPORATIVO */}
      <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 mb-6">
            <Building2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Painel Institucional</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">{profile?.nome}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
               <ShieldCheck size={12} className="text-indigo-400" />
               <span className="text-[9px] font-black uppercase tracking-widest">PJ • Taxa {profile?.taxa_percentual}%</span>
            </div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Status: {profile?.status_verificacao}</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px] -mr-24 -mt-24"></div>
      </section>

      {/* METRICAS FINANCEIRAS */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Landmark size={20} />
            </div>
            <div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Investimento Social</span>
               <p className="text-2xl font-black text-slate-900">R$ {profile?.total_donated.toLocaleString('pt-BR')}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ações Executadas</span>
               <p className="text-2xl font-black text-slate-900">{profile?.donations_count}</p>
            </div>
         </div>
      </div>

      {/* RELATÓRIOS */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recursos & Transparência</h3>
        </div>
        
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
           <button className="w-full flex items-center justify-between p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <FileText size={20} />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-sm">Relatório Mensal ESG</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">PDF Gerado em 01/02</span>
                </div>
              </div>
              <Download size={18} className="text-slate-300" />
           </button>
           
           <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Users size={20} />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-sm">Gestão de Colaboradores</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Em breve: Programa de Voluntariado</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
           </button>
        </div>
      </section>

      {/* ÚLTIMOS REPASSES */}
      <section className="space-y-4">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Histórico de Repasses</h3>
         <div className="space-y-3">
            {donations.length === 0 ? (
              <div className="p-10 bg-white rounded-[2.5rem] text-center border border-dashed border-slate-200">
                <p className="text-[10px] font-black text-slate-300 uppercase">Nenhuma transação registrada</p>
              </div>
            ) : (
              donations.map(d => (
                <div key={d.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs">
                      {new Date(d.created_at).getDate()}/{new Date(d.created_at).getMonth()+1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{d.pedidos_ajuda?.titulo}</p>
                      <span className="text-[9px] font-black text-slate-300 uppercase">Taxa {profile?.taxa_percentual}% aplicado</span>
                    </div>
                  </div>
                  <p className="font-black text-slate-900">R$ {d.valor}</p>
                </div>
              ))
            )}
         </div>
      </section>
    </div>
  );
};

export default DashboardPJ;
