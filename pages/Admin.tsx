import React from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Check, X } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, requests, approveRequest } = useApp();

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center text-red-600 font-bold">Acesso Negado</div>;
  }

  const pendingRequests = requests.filter(r => r.status === 'Aberto');

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Painel Administrativo</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-slate-700">Pedidos Pendentes de Aprovação</h2>
        </div>
        
        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Nenhum pedido pendente no momento.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pendingRequests.map(req => (
              <li key={req.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded">{req.category}</span>
                      <span className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-slate-800">{req.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-1">{req.description}</p>
                    <p className="text-xs text-slate-400 mt-1">Por: {req.userName} | Pix: {req.pixKey}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200">
                      <X size={16} />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => approveRequest(req.id)}>
                      <Check size={16} className="mr-1" /> Aprovar
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Admin;