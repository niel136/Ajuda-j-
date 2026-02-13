
import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
// Added Zap to imports to resolve "Cannot find name 'Zap'" error
import { 
  Building2, TrendingUp, ShieldCheck, Download, Users, Landmark, 
  FileText, ChevronRight, LayoutDashboard, History, FileStack, 
  Settings, LogOut, Search, Filter, ArrowUpRight, Award, 
  AlertCircle, Menu, X, Zap
} from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import Button from '../components/Button';
import { Navigate } from 'react-router-dom';

const DashboardPJ: React.FC = () => {
  const { profile, donations, fetchDonations, isLoading, logout } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  // Proteção de Rota
  if (!isLoading && profile?.tipo_usuario !== 'PJ') {
    return <Navigate to="/" replace />;
  }

  // Cálculo de Score Empresarial (Simulado)
  const companyScore = useMemo(() => {
    let score = 0;
    if (!profile) return 0;
    
    // 1. Tempo na plataforma (ex: 30 dias = 10 pts)
    const daysSinceCreated = Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24));
    score += Math.min(20, Math.floor(daysSinceCreated / 5) * 2);
    
    // 2. Volume doado (ex: R$ 500 = 5 pts)
    score += Math.min(30, Math.floor(profile.total_donated / 100) * 2);
    
    // 3. Verificação (50 pts)
    if (profile.status_verificacao === 'VERIFICADO') score += 50;
    
    return score;
  }, [profile]);

  const stats = {
    totalRaised: profile?.total_donated || 0,
    taxRate: profile?.taxa_percentual || 10,
    netRaised: (profile?.total_donated || 0) * (1 - (profile?.taxa_percentual || 10) / 100),
    actionsCount: profile?.donations_count || 0,
    growth: 12.5 // Simulado
  };

  const filteredDonations = donations.filter(d => 
    d.pedidos_ajuda?.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <LoadingScreen />;

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${
        activeTab === id 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 flex bg-pj-slate overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-pj-navy text-white transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="text-white" size={24} />
            </div>
            <h1 className="font-black text-xl tracking-tighter">AjudaJá <span className="text-blue-500">PJ</span></h1>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem id="transacoes" icon={History} label="Transações" />
            <NavItem id="relatorios" icon={FileStack} label="Relatórios" />
            <NavItem id="perfil" icon={Building2} label="Perfil Empresa" />
            <NavItem id="config" icon={Settings} label="Configurações" />
          </nav>

          <div className="pt-6 border-t border-slate-800">
            <button onClick={logout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
              <LogOut size={20} />
              <span className="font-bold text-sm tracking-tight">Sair do Painel</span>
            </button>
          </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
            <Menu size={24} />
          </button>
          
          <div className="hidden lg:block">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col text-right hidden sm:block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Empresa</span>
                <span className="font-black text-slate-900 leading-none">{profile?.nome}</span>
             </div>
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold border border-slate-200">
               {profile?.nome?.[0]}
             </div>
          </div>
        </header>

        {/* SCROLLABLE VIEW */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          
          <div className="max-w-6xl mx-auto space-y-8 pb-10">
            
            {/* VIEW: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-app-in">
                
                {/* WELCOME BANNER */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full mb-4">
                      <Award size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">ESG Performance Nível 2</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Visão Geral Corporativa</h2>
                    <p className="text-slate-400 font-bold text-sm">Monitore suas contribuições e o impacto social gerado pela sua empresa.</p>
                  </div>
                  
                  <div className="relative z-10 flex gap-4 shrink-0">
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center min-w-[120px]">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Empresa Score</span>
                        <span className="text-3xl font-black text-blue-600 tracking-tighter">{companyScore}</span>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${companyScore}%` }}></div>
                        </div>
                     </div>
                  </div>
                  
                  {/* BG Accent */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                </section>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Landmark size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Arrecadação Bruta</span>
                        <div className="flex items-baseline gap-2">
                           <p className="text-2xl font-black text-slate-900 tracking-tighter">R$ {stats.totalRaised.toLocaleString('pt-BR')}</p>
                           <span className="text-emerald-500 text-[10px] font-black flex items-center gap-0.5">
                             <TrendingUp size={10} /> {stats.growth}%
                           </span>
                        </div>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <ArrowUpRight size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Valor Líquido Social</span>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">R$ {stats.netRaised.toLocaleString('pt-BR')}</p>
                        <span className="text-[10px] font-bold text-slate-300">Deduzido {stats.taxRate}% de taxa</span>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <Zap size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ações Executadas</span>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">{stats.actionsCount}</p>
                        <span className="text-[10px] font-bold text-slate-300">Em 12 categorias</span>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status Registro</span>
                        <p className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{profile?.status_verificacao}</p>
                        <span className="text-[10px] font-bold text-slate-300">Verificado via BrasilAPI</span>
                      </div>
                   </div>
                </div>

                {/* TRANSACTIONS PREVIEW */}
                <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Últimas Movimentações</h3>
                      <button onClick={() => setActiveTab('transacoes')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver todas</button>
                   </div>
                   
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50">
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Bruto</th>
                              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Liquidez Social</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {donations.slice(0, 5).map(d => (
                             <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6 font-bold text-slate-400 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                                <td className="px-8 py-6 font-black text-slate-900 text-sm">{d.pedidos_ajuda?.titulo}</td>
                                <td className="px-8 py-6 font-bold text-slate-600">R$ {d.valor}</td>
                                <td className="px-8 py-6 font-black text-blue-600 text-right">R$ {(d.valor * (1 - stats.taxRate / 100)).toFixed(2)}</td>
                             </tr>
                           ))}
                           {donations.length === 0 && (
                             <tr>
                                <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold text-sm italic">Nenhuma transação registrada.</td>
                             </tr>
                           )}
                        </tbody>
                      </table>
                   </div>
                </section>
              </div>
            )}

            {/* VIEW: TRANSAÇÕES COMPLETA */}
            {activeTab === 'transacoes' && (
              <div className="space-y-6 animate-app-in">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Histórico de Transações</h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                       <div className="relative flex-1 sm:w-64">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                          <input 
                            placeholder="Buscar transação..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full h-11 bg-white rounded-xl border border-slate-200 pl-11 pr-4 font-bold text-xs outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                       </div>
                       <button className="h-11 w-11 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900"><Filter size={18} /></button>
                    </div>
                 </div>

                 <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                             <tr className="bg-slate-50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bruto</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxa platform</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Líquido Impacto</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {filteredDonations.map(d => (
                               <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-8 py-6 font-bold text-slate-400 text-xs">{new Date(d.created_at).toLocaleString()}</td>
                                  <td className="px-8 py-6 font-black text-slate-900 text-sm">{d.pedidos_ajuda?.titulo}</td>
                                  <td className="px-8 py-6 font-bold text-slate-600">R$ {d.valor}</td>
                                  <td className="px-8 py-6 font-bold text-red-500 text-xs">-{stats.taxRate}%</td>
                                  <td className="px-8 py-6 font-black text-emerald-600 text-right">R$ {(d.valor * (1 - stats.taxRate / 100)).toFixed(2)}</td>
                               </tr>
                             ))}
                          </tbody>
                        </table>
                    </div>
                 </section>
              </div>
            )}

            {/* VIEW: RELATÓRIOS */}
            {activeTab === 'relatorios' && (
              <div className="space-y-6 animate-app-in">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Relatórios de Transparência</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { month: 'Janeiro', year: '2025', size: '2.4 MB' },
                      { month: 'Dezembro', year: '2024', size: '1.8 MB' },
                      { month: 'Novembro', year: '2024', size: '2.1 MB' }
                    ].map((rep, i) => (
                      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-6 group hover:border-blue-500 transition-colors">
                         <div className="w-14 h-14 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 rounded-2xl flex items-center justify-center transition-colors">
                           <FileText size={28} />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-900">Relatório ESG {rep.month}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{rep.year} • {rep.size}</p>
                         </div>
                         <button className="mt-2 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-3 transition-all">
                           Download PDF <Download size={14} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* VIEW: PERFIL EMPRESA */}
            {activeTab === 'perfil' && (
              <div className="space-y-8 animate-app-in">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Perfil Corporativo</h2>
                   <Button variant="black" size="sm" className="bg-blue-600 rounded-xl">Editar Dados</Button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-100 flex items-center gap-6">
                      <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] border border-slate-200 flex items-center justify-center text-slate-400 text-3xl font-black">
                        {profile?.nome?.[0]}
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2">{profile?.nome}</h3>
                         <div className="flex gap-2">
                           <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight flex items-center gap-1">
                             <ShieldCheck size={12} /> Empresa Verificada
                           </span>
                           <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight">
                             CNPJ: {profile?.cnpj}
                           </span>
                         </div>
                      </div>
                   </div>

                   <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informações Cadastrais</h4>
                         <div className="space-y-4">
                            <div>
                               <label className="text-[9px] font-bold text-slate-300 uppercase tracking-widest block mb-1">Razão Social</label>
                               <p className="font-bold text-slate-800">{profile?.metadata_onboarding?.razao_social || profile?.nome}</p>
                            </div>
                            <div>
                               <label className="text-[9px] font-bold text-slate-300 uppercase tracking-widest block mb-1">Segmento Principal</label>
                               <p className="font-bold text-slate-800">{profile?.metadata_onboarding?.segmento || 'Não informado'}</p>
                            </div>
                            <div>
                               <label className="text-[9px] font-bold text-slate-300 uppercase tracking-widest block mb-1">Responsável Legal</label>
                               <p className="font-bold text-slate-800">{profile?.metadata_onboarding?.responsavel || 'Não informado'}</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentação ESG</h4>
                         <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center flex flex-col items-center">
                            <AlertCircle size={32} className="text-slate-300 mb-4" />
                            <p className="text-xs font-bold text-slate-400 max-w-[200px] mb-6">Mantenha seu Contrato Social e Balanço atualizados para manter o Score alto.</p>
                            <Button variant="outline" size="sm" className="border-slate-200 text-slate-500">Enviar Documentos</Button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPJ;
