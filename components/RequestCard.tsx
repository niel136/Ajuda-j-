
import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp, CreditCard, Share2, CheckCircle2, DollarSign, Clock, AlertTriangle, ShieldCheck, Camera } from 'lucide-react';
import Button from './Button';
import MascotAvatar from './MascotAvatar';
import { useApp } from '../context/AppContext';
import { HelpRequest } from '../types';

const RequestCard: React.FC<{ request: HelpRequest; minimal?: boolean }> = ({ request, minimal = false }) => {
  const { processDonation, submitForAnalysis, releaseFunds, submitProof, user } = useApp();
  const [showDonate, setShowDonate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [proofUrl, setProofUrl] = useState('');

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

  const getStatusConfig = (status: string) => {
    const configs: any = {
      RASCUNHO: { label: 'Rascunho', color: 'bg-gray-100 text-gray-500', icon: <Clock size={12}/> },
      EM_ANALISE: { label: 'Em Análise', color: 'bg-blue-100 text-blue-600', icon: <Clock size={12}/> },
      EM_ANALISE_CRITICA: { label: 'Análise Prioritária', color: 'bg-orange-100 text-orange-600', icon: <AlertTriangle size={12}/> },
      PUBLICADO: { label: 'Ativo', color: 'bg-[#E2F687] text-black', icon: <ShieldCheck size={12}/> },
      META_BATIDA: { label: 'Meta Atingida!', color: 'bg-green-100 text-green-600', icon: <CheckCircle2 size={12}/> },
      AGUARDANDO_PROVA: { label: 'Aguardando Prova', color: 'bg-purple-100 text-purple-600', icon: <Camera size={12}/> },
      CONCLUIDO: { label: 'Concluído', color: 'bg-green-500 text-white', icon: <CheckCircle2 size={12}/> }
    };
    return configs[status] || { label: status, color: 'bg-gray-200' };
  };

  const cfg = getStatusConfig(request.status);

  return (
    <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden animate-app-in">
      <div className="p-5 flex gap-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-50 border border-black/5 relative">
          <img src={`https://picsum.photos/400/300?seed=${request.id}`} className="w-full h-full object-cover" alt="" />
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-sm ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </div>
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{request.categoria}</span>
          <h3 className="font-extrabold text-gray-900 text-lg leading-tight truncate">{request.titulo}</h3>
          <div className="flex items-center text-gray-400 text-[10px] mt-1 font-bold">
            <MascotAvatar seed={request.profiles?.avatar_seed || request.user_id} size={16} className="mr-1 rounded-full" />
            <span className="truncate">{request.profiles?.nome || 'Usuário'}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-1">
        <div className="flex justify-between items-end mb-3">
           <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Arrecadado</span>
              <span className="text-base font-extrabold text-black">R$ {(request.valor_atual || 0).toLocaleString('pt-BR')}</span>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Meta</span>
              <span className="text-sm font-bold text-gray-500">R$ {(request.valor_meta || 0).toLocaleString('pt-BR')}</span>
           </div>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-5">
          <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${percentRaised}%` }}></div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Ações para o Dono */}
          {isOwner && (
            <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
              {request.status === 'RASCUNHO' && (
                <Button variant="black" fullWidth onClick={() => submitForAnalysis(request.id)}>Enviar para Análise</Button>
              )}
              {request.status === 'META_BATIDA' && (
                <Button variant="primary" fullWidth onClick={() => releaseFunds(request.id)}>Solicitar Saque</Button>
              )}
              {request.status === 'AGUARDANDO_PROVA' && (
                <div className="space-y-2">
                  <input 
                    placeholder="URL da foto de prova (ex: Imgur)" 
                    className="w-full p-3 rounded-xl border border-black/5 text-xs outline-none focus:ring-2 focus:ring-black"
                    value={proofUrl}
                    onChange={e => setProofUrl(e.target.value)}
                  />
                  <Button variant="black" fullWidth onClick={() => submitProof(request.id, proofUrl)}>Enviar Prova e Concluir</Button>
                </div>
              )}
            </div>
          )}

          {/* Ações para o Doador */}
          {request.status === 'PUBLICADO' && !isOwner && (
            <div className="space-y-3">
              {showDonate ? (
                <div className="animate-app-in space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Valor R$" 
                      className="flex-1 p-4 rounded-2xl border border-black/5 font-bold"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                    <Button variant="black" onClick={handleDonate} isLoading={isProcessing}>Doar</Button>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase text-center break-all">Pix: {request.pix_key}</p>
                </div>
              ) : (
                <Button variant="black" fullWidth onClick={() => setShowDonate(true)}>Ajudar agora</Button>
              )}
            </div>
          )}

          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1 py-2">
            {isExpanded ? 'Ver menos' : 'Ler história completa'} {isExpanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          </button>
          
          {isExpanded && <p className="text-xs text-gray-500 leading-relaxed animate-app-in">{request.descricao}</p>}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;