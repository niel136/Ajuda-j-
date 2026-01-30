import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import RequestCard from '../components/RequestCard';
import { Filter } from 'lucide-react';

const Feed: React.FC = () => {
  const { requests } = useApp();
  const [filter, setFilter] = useState<'Todos' | 'Alimentação' | 'Saúde' | 'Reforma'>('Todos');

  const filteredRequests = requests.filter(req => 
    filter === 'Todos' ? true : req.category === filter
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Pedidos de Ajuda</h2>
        <div className="flex items-center space-x-2">
            <Filter size={16} className="text-slate-400" />
            <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer"
            >
                <option value="Todos">Todos</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Saúde">Saúde</option>
                <option value="Reforma">Reforma</option>
            </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <p className="text-slate-500">Nenhum pedido encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;