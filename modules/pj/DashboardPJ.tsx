
import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, TrendingUp, ShieldCheck, Download, Users, Landmark, 
  FileText, LayoutDashboard, History, FileStack, 
  Settings, LogOut, Search, Filter, ArrowUpRight, Award, 
  AlertCircle, Menu, Zap, BarChart3
} from 'lucide-react';
import LoadingScreen from '../../components/LoadingScreen';
import Button from '../../components/Button';
import { Navigate } from 'react-router-dom';

const DashboardPJ: React.FC = () => {
  const { profile, donations, fetchDonations, isLoading, logout } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  if (isLoading) return <LoadingScreen />;

  // Force protection
  if (profile?.tipo_usuario !== 'PJ') {
    return <Navigate to="/dashboard/pf" replace />;
  }

  const companyScore = useMemo(() => {
    if (!profile) return 0;
    let score = 40; // Base score
    if (profile.status_verificacao === 'VERIFICADO') score += 40;
    score += Math.min(20, (profile.donations_count || 0) * 2);
    return score;
  }, [profile]);

  const stats = {
    totalRaised: profile?.total_donated || 0,
    taxRate: 10,
    netRaised: (profile?.total_donated || 0) * 0.9,
    actionsCount: profile?.donations_count || 0,
  };

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${
        activeTab === id 
        ? 'bg-indigo-600 text-white shadow-lg' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 flex bg-slate-50 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="text-white" size={24} />
            </div>
            <h1 className="font-black text-xl tracking-tighter italic">AjudaJá <span className="text-indigo-400">CORP</span></h1>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Painel ESG" />
            <NavItem id="transacoes" icon={History} label="Aportes" />
            <NavItem id="relatorios" icon={FileStack} label="Relatórios" />
            <NavItem id="perfil" icon={Building2} label="Dados Empresa" />
          </nav>

          <div className="pt-6 border-t border-slate-800">
            <button onClick={logout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
              <LogOut size={20} />
              <span className="font-bold text-sm">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>}

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{activeTab}</h2>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <span className="text-[10px] font-black text-slate-400 uppercase block leading-none mb-1">Empresa</span>
                <span className="font-black text-slate-900 leading-none">{profile?.nome}</span>
             </div>
             <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 uppercase">
               {profile?.nome?.[0]}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-app-in">
                {/* BANNER */}
                <section className="bg-white p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full mb-4">
                      <Award size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Nível de Reputação Corporativa</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Performance de Impacto</h2>
                    <p className="text-slate-400 font-bold text-sm">Acompanhe como sua empresa está mudando realidades.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center min-w-[140px] z-10">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Impact Score</span>
                    <span className="text-4xl font-black text-indigo-600 tracking-tighter">{companyScore}</span>
                  </div>
                </section>

                {/* KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Landmark size={20} /></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Aportado</span>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">R$ {stats.totalRaised.toLocaleString('pt-BR')}</p>
                   </div>
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><Zap size={20} /></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Liquidez Social</span>
                      <p className="text-2xl font-black text-emerald-600 tracking-tighter">R$ {stats.netRaised.toLocaleString('pt-BR')}</p>
                   </div>
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4"><BarChart3 size={20} /></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ações Apoiadas</span>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">{stats.actionsCount}</p>
                   </div>
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4"><ShieldCheck size={20} /></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Verificação</span>
                      <p className="text-lg font-black text-indigo-600 uppercase tracking-tighter">{profile?.status_verificacao}</p>
                   </div>
                </div>

                {/* TRANSACTIONS TABLE */}
                <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Últimos Aportes</h3>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50">
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Título</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Líquido Social</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {donations.map(d => (
                             <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-6 font-bold text-slate-400 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                                <td className="px-8 py-6 font-black text-slate-900 text-sm">{d.pedidos_ajuda?.titulo}</td>
                                <td className="px-8 py-6 font-black text-indigo-600 text-right">R$ {(d.valor * 0.9).toFixed(2)}</td>
                             </tr>
                           ))}
                           {donations.length === 0 && (
                             <tr><td colSpan={3} className="p-10 text-center text-slate-300 italic">Sem registros.</td></tr>
                           )}
                        </tbody>
                      </table>
                   </div>
                </section>
              </div>
            )}

            {/* RELATÓRIOS VIEW */}
            {activeTab === 'relatorios' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-app-in">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
                    <FileText size={40} className="text-slate-300" />
                    <h4 className="font-black text-slate-900">Relatório de Transparência #{i}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">PDF • 1.2MB</p>
                    <Button variant="secondary" className="mt-4 border-slate-200"><Download size={16} className="mr-2" /> Baixar</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPJ;
