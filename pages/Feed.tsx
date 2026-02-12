
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
    <div className="flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Explorar</h2>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Sincronizado agora</p>
        </div>
        <div className="bg-black text-[#E2F687] p-2.5 rounded-2xl flex items-center justify-center">
          <Zap size={18} fill="currentColor" />
        </div>
      </div>
      
      <div className="relative group w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
          <Search size={18} />
        </div>
        <input 
          type="text"
          placeholder="Busque ajuda..."
          className="w-full bg-white border border-black/5 rounded-2xl py-4 pl-11 pr-4 shadow-sm font-bold text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        {filteredRequests.map(req => (
          <RequestCard key={req.id} request={req} />
        ))}
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
               <Sparkles size={24} className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-400 uppercase text-[9px] tracking-widest">Nenhum resultado encontrado...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
