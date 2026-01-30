import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Eye, Zap, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';

const Home: React.FC = () => {
  const { user, requests } = useApp();
  const firstName = user?.name.split(' ')[0] || 'Visitante';

  return (
    <div className="pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-0.5">Bem-vindo de volta,</p>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                {firstName} <span className="text-2xl">👋</span>
            </h1>
        </div>
        <Link to="/perfil">
            <img 
                src={user?.avatarUrl || 'https://picsum.photos/100/100'} 
                className="w-12 h-12 rounded-full border-2 border-gray-900"
                alt="Avatar"
            />
        </Link>
      </div>

      {/* Main Dashboard Card - The "Black Card" from reference */}
      <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-gray-900/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2F687] rounded-full blur-3xl opacity-10 transform translate-x-10 -translate-y-10"></div>
        
        <div className="flex justify-between items-start mb-8">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10 flex items-center gap-1">
                <Zap size={12} className="text-[#E2F687]" /> Impacto Social
            </div>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Eye size={18} />
            </button>
        </div>

        <div className="mb-8">
            <p className="text-gray-400 text-sm font-medium mb-1">Total Ajudado</p>
            <h2 className="text-4xl font-bold tracking-tight">
                R$ 1.250<span className="text-gray-500 text-2xl">.00</span>
            </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <Link to="/novo-pedido" className="bg-[#E2F687] text-gray-900 rounded-[1.2rem] py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm hover:bg-[#d4f060] transition-colors">
                <Plus size={18} /> Pedir
             </Link>
             <Link to="/feed" className="bg-white/10 text-white rounded-[1.2rem] py-3 px-4 flex items-center justify-center gap-2 font-bold text-sm hover:bg-white/20 transition-colors border border-white/5">
                <Search size={18} /> Explorar
             </Link>
        </div>
      </div>

      {/* Quick Stats / Categories */}
      <div className="mb-8">
         <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="font-bold text-lg text-gray-900">Atividades Recentes</h3>
            <Link to="/feed" className="text-xs font-bold text-gray-500 hover:text-gray-900">Ver tudo</Link>
         </div>

         {/* Filter Chips - Horizontal Scroll */}
         <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {['Tudo', 'Alimentação', 'Saúde', 'Urgente'].map((cat, i) => (
                <button 
                    key={cat} 
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    {cat}
                </button>
            ))}
         </div>
      </div>

      {/* Recent Requests List */}
      <div className="space-y-4">
         {requests.slice(0, 3).map(req => (
             <RequestCard key={req.id} request={req} minimal />
         ))}
      </div>
    </div>
  );
};

export default Home;