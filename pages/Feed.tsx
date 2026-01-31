import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';
import { Filter, Search } from 'lucide-react';

const Feed: React.FC = () => {
  const { requests } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests.filter(req => 
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explorar</h2>
      
      {/* Search Bar Mobile */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="O que você procura?"
          className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm font-medium focus:ring-2 focus:ring-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {['Todos', 'Alimentação', 'Saúde', 'Urgente'].map((cat, i) => (
          <button 
            key={cat} 
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap active:scale-95 transition-all ${i === 0 ? 'bg-black text-white' : 'bg-white text-gray-500'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vertical List */}
      <div className="flex flex-col gap-5">
        {filteredRequests.map(req => (
          <RequestCard key={req.id} request={req} />
        ))}
        {filteredRequests.length === 0 && (
          <div className="text-center py-20 opacity-50 font-bold">Nenhum pedido encontrado.</div>
        )}
      </div>
    </div>
  );
};

export default Feed;