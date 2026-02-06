
import React from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Check, X, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const Admin: React.FC = () => {
  const { user, profile, requests, moderateRequest } = useApp();

  if (profile?.tipo_conta !== 'admin') {
    return <div className="p-10 text-center font-black uppercase text-red-500">Acesso Restrito</div>;
  }

  const pending = requests.filter(r => r.status === 'EM_ANALISE' || r.status === 'EM_ANALISE_CRITICA');

  return (
    <div className="animate-app-in">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-black tracking-tighter">Moderação</h2>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Fila de Aprovação Real-time</p>
      </div>
      
      <div className="space-y-4">
        {pending.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
            <p className="text-gray-300 font-black uppercase text-xs">Tudo limpo por aqui</p>
          </div>
        ) : (
          pending.map(req => (
            <div key={req.id} className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {req.status === 'EM_ANALISE_CRITICA' ? (
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight flex items-center gap-1">
                        <AlertTriangle size={12}/> Análise Crítica
                      </span>
                    ) : (
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight">Análise Padrão</span>
                    )}
                    <span className="text-[9px] font-black text-gray-300 uppercase">Score IA: {req.score_confianca_ia}%</span>
                  </div>
                  <h3 className="font-black text-gray-900 text-lg leading-tight truncate">{req.titulo}</h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">Por: {req.profiles?.nome} | R$ {req.valor_meta}</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 line-clamp-3 bg-gray-50 p-4 rounded-2xl italic">"{req.descricao}"</p>
              
              <div className="grid grid-cols-3 gap-2">
                <Button size="sm" variant="ghost" className="bg-blue-50 text-blue-600 h-12" onClick={() => moderateRequest(req.id, 'INFO')}>
                  <Info size={16}/> Info
                </Button>
                <Button size="sm" variant="ghost" className="bg-red-50 text-red-600 h-12" onClick={() => moderateRequest(req.id, 'NEGAR')}>
                  <X size={16}/> Negar
                </Button>
                <Button size="sm" variant="black" className="h-12" onClick={() => moderateRequest(req.id, 'APROVAR')}>
                  <Check size={16} className="text-[#E2F687]"/> Aprovar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
