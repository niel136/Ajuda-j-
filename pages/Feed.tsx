import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';
import { Search, Sparkles, Zap } from 'lucide-react';

const Feed: React.FC = () => {
  const { requests } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter(req => 
      req.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      req.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requests, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explorar</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sincronizado agora</p>
        </div>
        <div className="bg-black text-[#E2F687] p-3 rounded-2xl flex items-center justify-center">
          <Zap size={20} fill="currentColor" />
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Ex: Alimentos, Remédios..."
          className="w-full bg-white border border-black/5 rounded-[1.5rem] py-5 pl-12 pr-4 shadow-sm font-bold text-sm focus:ring-4 focus:ring-black/5 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-5">
        {filteredRequests.map(req => (
          <RequestCard key={req.id} request={req} />
        ))}
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-24 flex flex-col items-center animate-pulse">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <Sparkles size={32} className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Aguardando novos pedidos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;