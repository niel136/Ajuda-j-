import React, { useState } from 'react';
import { HelpRequest } from '../types';
import { MapPin, CheckCircle, ChevronDown, ChevronUp, Zap, CreditCard } from 'lucide-react';
import Button from './Button';
import { useApp } from '../context/AppContext';

const RequestCard: React.FC<{ request: HelpRequest; minimal?: boolean }> = ({ request, minimal = false }) => {
  const { addDonation } = useApp();
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const percentRaised = Math.min(100, Math.round((request.amountRaised / request.amountNeeded) * 100));
  
  const handleDonate = () => {
    if (!donateAmount || isNaN(Number(donateAmount))) return;
    addDonation(request.id, Number(donateAmount));
    setDonateAmount('');
    setShowDonate(false);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-black/[0.03] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden transition-all active:scale-[0.99]">
      
      {/* CONTEÚDO PRINCIPAL COM MIN-W-0 PARA EVITAR QUEBRA */}
      <div className="p-4 flex gap-4 min-w-0">
        
        {/* IMAGEM COM PROPORÇÃO FIXA */}
        <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-black/[0.05]">
          <img 
            src={request.imageUrl} 
            alt={request.title} 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        </div>
        
        {/* TEXTO COM CONTROLE DE OVERFLOW */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between items-center gap-2">
             <span className="text-[10px] font-extrabold uppercase tracking-tighter bg-[#E2F687] px-2 py-0.5 rounded text-black truncate">
                {request.category}
             </span>
             {request.urgency === 'Crítica' && (
                <span className="flex items-center text-[10px] font-bold text-red-500 animate-pulse">
                    <Zap size={10} className="mr-0.5 fill-current" /> URGENTE
                </span>
             )}
          </div>
          
          <h3 className="font-extrabold text-gray-900 text-base mt-1.5 leading-tight truncate">
            {request.title}
          </h3>
          
          <div className="flex items-center text-gray-400 text-xs mt-1">
            <MapPin size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>

          {!minimal && (
            <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                {request.description}
            </p>
          )}
        </div>
      </div>

      {/* SEÇÃO DE PROGRESSO PADRONIZADA */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-end mb-1.5">
           <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Arrecadado</span>
              <span className="text-sm font-extrabold text-black">R$ {request.amountRaised.toLocaleString('pt-BR')}</span>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Meta</span>
              <span className="text-xs font-bold text-gray-600">R$ {request.amountNeeded.toLocaleString('pt-BR')}</span>
           </div>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-1">
          <div 
            className="h-full bg-black rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
            style={{ width: `${percentRaised}%` }}
          ></div>
        </div>
        <span className="text-[10px] font-black text-black/40">{percentRaised}% completo</span>
      </div>

      {/* BOTÕES DE AÇÃO - UX REFINADA */}
      {!minimal && (
        <div className="px-4 pb-4 pt-2 border-t border-black/[0.03] flex flex-col gap-3">
             <div className="flex gap-2">
                <Button 
                    variant={showDonate ? "secondary" : "black"} 
                    size="md" 
                    fullWidth 
                    onClick={() => setShowDonate(!showDonate)}
                    className="h-12 text-sm"
                >
                    {showDonate ? 'Fechar' : 'Fazer Doação'}
                </Button>
                
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 btn-active border border-black/[0.03]"
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
             </div>

             {/* DETALHES EXPANDIDOS */}
             {isExpanded && (
                 <div className="text-sm text-gray-600 space-y-4 animate-app-in py-2">
                     <div className="p-4 bg-gray-50 rounded-2xl border border-black/[0.02]">
                        <p className="font-bold text-black mb-1">Sobre o pedido:</p>
                        <p className="leading-relaxed">{request.description}</p>
                     </div>
                     
                     {request.updates.length > 0 && (
                         <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Últimas Atualizações</h4>
                            {request.updates.map(u => (
                                <div key={u.id} className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/30">
                                    <span className="text-[10px] font-bold text-blue-400 block mb-1">{new Date(u.date).toLocaleDateString('pt-BR')}</span>
                                    <p className="text-xs text-blue-900/80">{u.text}</p>
                                </div>
                            ))}
                         </div>
                     )}
                 </div>
             )}

            {/* INPUT DE DOAÇÃO ESTILO BANCO */}
            {showDonate && (
                <div className="animate-app-in space-y-3 pt-2">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</div>
                        <input 
                            type="number" 
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl pl-10 pr-4 py-4 font-extrabold text-xl transition-all focus:bg-white"
                            placeholder="0,00"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.value)}
                            inputMode="decimal"
                        />
                    </div>
                    <Button onClick={handleDonate} disabled={!donateAmount} variant="black" fullWidth className="h-14">
                        <CreditCard size={18} className="mr-2" /> Confirmar Doação via Pix
                    </Button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default RequestCard;