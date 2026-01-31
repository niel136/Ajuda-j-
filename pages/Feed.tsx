import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';
import { Filter, Search } from 'lucide-react';

const Feed: React.FC = () => {
  const { requests } = useApp();
  const [filter, setFilter] = useState<'Todos' | 'Alimentação' | 'Saúde' | 'Reforma'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'Todos' ? true : req.category === filter;
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Pedidos de Ajuda</h2>
            <p className="text-slate-500 font-medium mt-1">Descubra causas reais precisando do seu apoio.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text"
                    placeholder="Buscar por local ou título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white/50 border-none rounded-2xl w-full sm:w-64 focus:ring-2 focus:ring-black transition-all"
                />
            </div>
            
            <div className="flex items-center gap-2 bg-white/50 px-4 py-3 rounded-2xl">
                <Filter size={18} className="text-slate-400" />
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer pr-4"
                >
                    <option value="Todos">Todas Categorias</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Reforma">Reforma</option>
                </select>
            </div>
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 rounded-[3rem] border border-dashed border-black/10">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Nenhum resultado</h3>
          <p className="text-slate-500 mt-2">Tente mudar os filtros ou o termo de busca.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;