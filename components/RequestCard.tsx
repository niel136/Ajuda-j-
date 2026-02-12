
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, Clock, CheckCircle2, AlertTriangle, Camera } from 'lucide-react';
import Button from './Button';
import MascotAvatar from './MascotAvatar';
import { useApp } from '../context/AppContext';
import { HelpRequest } from '../types';

const RequestCard: React.FC<{ request: HelpRequest; minimal?: boolean }> = ({ request, minimal = false }) => {
  const { processDonation, user } = useApp();
  const [showDonate, setShowDonate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const percentRaised = Math.min(100, Math.round(((request.valor_atual || 0) / (request.valor_meta || 1)) * 100));
  const isOwner = user?.id === request.user_id;

  const handleDonate = async () => {
    const val = parseFloat(amount);
    if (!val) return;
    setIsProcessing(true);
    try {
      await processDonation(request.id, val);
      setShowDonate(false);
    } catch (e) {
      alert("Erro ao processar doação");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-[#111111]/5 shadow-sm overflow-hidden animate-app-in group">
      <div className="p-6 flex gap-5">
        <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-[#F6F6F6] border border-[#111111]/5 relative">
          <img src={`https://picsum.photos/400/300?seed=${request.id}`} className="w-full h-full object-cover" alt="" />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-[9px] font-black uppercase tracking-widest text-[#111111]/30">{request.categoria}</span>
             <div className="w-1 h-1 bg-[#111111]/10 rounded-full"></div>
             <span className="text-[9px] font-black uppercase tracking-widest text-[#C6F64E] bg-[#111111] px-2 py-0.5 rounded-full">Ativo</span>
          </div>
          <h3 className="font-black text-[#111111] text-lg leading-tight truncate tracking-tight">{request.titulo}</h3>
          <div className="flex items-center text-[#111111]/30 text-[10px] mt-1 font-bold">
            <MascotAvatar seed={request.profiles?.avatar_seed || request.user_id} size={16} className="mr-1 rounded-full" />
            <span className="truncate">{request.profiles?.nome || 'Usuário'}</span>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 pt-0">
        <div className="flex justify-between items-end mb-4">
           <div>
              <span className="text-xl font-black text-[#111111]">R$ {(request.valor_atual || 0).toLocaleString('pt-BR')}</span>
              <span className="text-[10px] font-bold text-[#111111]/30 uppercase tracking-widest block">Arrecadado</span>
           </div>
           <div className="text-right">
              <span className="text-sm font-black text-[#111111]/40">R$ {(request.valor_meta || 0).toLocaleString('pt-BR')}</span>
              <span className="text-[10px] font-bold text-[#111111]/30 uppercase tracking-widest block">Meta</span>
           </div>
        </div>
        
        <div className="w-full bg-[#F6F6F6] rounded-full h-2 overflow-hidden mb-6">
          <div className="h-full bg-[#111111] rounded-full transition-all duration-1000" style={{ width: `${percentRaised}%` }}></div>
        </div>

        <div className="flex flex-col gap-3">
          {request.status === 'PUBLICADO' && !isOwner && (
            <div className="space-y-4">
              {showDonate ? (
                <div className="animate-app-in space-y-4">
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="Valor R$" 
                      className="flex-1 px-6 rounded-2xl border border-[#111111]/5 font-black text-sm h-14 outline-none focus:ring-2 focus:ring-[#C6F64E]"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                    <Button variant="black" onClick={handleDonate} isLoading={isProcessing} className="h-14">Doar</Button>
                  </div>
                </div>
              ) : (
                <Button variant="black" fullWidth onClick={() => setShowDonate(true)} className="rounded-2xl h-14">Ajudar agora</Button>
              )}
            </div>
          )}

          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[9px] font-black text-[#111111]/20 uppercase tracking-[0.2em] flex items-center justify-center gap-2 py-3">
            {isExpanded ? 'Ver menos' : 'Ler história'} {isExpanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          </button>
          
          {isExpanded && <p className="text-xs text-[#111111]/60 leading-relaxed animate-app-in font-medium">{request.descricao}</p>}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
