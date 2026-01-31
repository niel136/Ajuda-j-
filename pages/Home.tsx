import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Zap, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';

const Home: React.FC = () => {
  const { user, requests } = useApp();
  const firstName = user?.name.split(' ')[0] || 'Visitante';

  return (
    <div className="pb-8 pt-6">
      {/* Header Responsivo */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-600 mb-0.5">Bem-vindo de volta,</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
                {firstName} <span className="text-2xl sm:text-3xl">👋</span>
            </h1>
        </div>
        <Link to="/perfil" className="md:hidden">
            <img 
                src={user?.avatarUrl || 'https://picsum.photos/100/100'} 
                className="w-12 h-12 rounded-full border-2 border-gray-900 object-cover"
                alt="Avatar"
            />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lado Esquerdo: Dashboard Card (Principal no Mobile, Lateral no Desktop se desejar, mas aqui mantemos no fluxo) */}
        <div className="lg:col-span-4 h-full">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-900/20 relative overflow-hidden h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2F687] rounded-full blur-3xl opacity-10 transform translate-x-10 -translate-y-10"></div>
                
                <div>
                    <div className="flex justify-between items-start mb-8">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-white/10 flex items-center gap-1">
                            <Zap size={14} className="text-[#E2F687]" /> Impacto Social
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <Eye size={18} />
                        </button>
                    </div>

                    <div className="mb-8">
                        <p className="text-gray-400 text-sm sm:text-base font-medium mb-1">Total Ajudado</p>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                            R$ 1.250<span className="text-gray-500 text-2xl sm:text-3xl">.00</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <Link to="/novo-pedido" className="bg-[#E2F687] text-gray-900 rounded-2xl py-4 px-4 flex items-center justify-center gap-2 font-bold text-sm sm:text-base hover:bg-[#d4f060] transition-transform hover:scale-[1.02]">
                        <Plus size={20} /> Pedir
                    </Link>
                    <Link to="/feed" className="bg-white/10 text-white rounded-2xl py-4 px-4 flex items-center justify-center gap-2 font-bold text-sm sm:text-base hover:bg-white/20 transition-transform hover:scale-[1.02] border border-white/5">
                        <Search size={20} /> Explorar
                    </Link>
                </div>
            </div>
        </div>

        {/* Lado Direito: Atividades Recentes com Grid Responsivo */}
        <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-6 px-1">
                <h3 className="font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">Atividades Recentes</h3>
                <Link to="/feed" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Ver tudo</Link>
            </div>

            {/* Filtros */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-2">
                {['Tudo', 'Alimentação', 'Saúde', 'Urgente'].map((cat, i) => (
                    <button 
                        key={cat} 
                        className={`px-6 py-3 rounded-full text-sm sm:text-base font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20' : 'bg-white text-gray-600 hover:bg-white/80'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Lista em Grid: 1 col (mobile), 2 cols (tablet), 2 cols (desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requests.slice(0, 4).map(req => (
                    <RequestCard key={req.id} request={req} minimal />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;