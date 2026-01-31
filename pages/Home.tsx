import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Zap, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';

const Home: React.FC = () => {
  const { user, requests } = useApp();
  const firstName = user?.name.split(' ')[0] || 'Visitante';

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Card */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Olá,</p>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{firstName} 👋</h2>
      </section>

      {/* Main Stats Card */}
      <div className="bg-gray-900 rounded-[2rem] p-7 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2F687] rounded-full blur-3xl opacity-10 -translate-y-10 translate-x-10"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#E2F687] border border-white/5">
            Membro Ativo
          </div>
          <Zap size={20} className="text-[#E2F687]" />
        </div>

        <p className="text-gray-400 text-sm font-medium">Você já ajudou com</p>
        <h3 className="text-4xl font-bold mt-1 tracking-tighter">R$ 1.250,00</h3>
        
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Link to="/novo-pedido" className="bg-[#E2F687] text-gray-900 py-3 rounded-xl font-bold text-center active:scale-95 transition-all text-sm">
            Fazer Pedido
          </Link>
          <Link to="/feed" className="bg-white/10 text-white py-3 rounded-xl font-bold text-center active:scale-95 transition-all text-sm border border-white/5">
            Explorar
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-extrabold text-gray-900">Perto de você</h3>
          <Link to="/feed" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ver Todos</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          {requests.slice(0, 3).map(req => (
            <RequestCard key={req.id} request={req} minimal />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;