import React, { useState } from 'react';
import { HelpRequest } from '../types';
import { MapPin, ChevronDown, ChevronUp, Zap, CreditCard } from 'lucide-react';
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
    <div className="bg-white rounded-[1.5rem] border border-black/5 shadow-sm overflow-hidden animate-app-in">
      <div className="p-5 flex gap-5">
        <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-black/5">
          <img src={request.imageUrl} alt={request.title} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
             <span className="text-[9px] font-black uppercase tracking-wider bg-[#E2F687]/30 px-2 py-0.5 rounded text-black truncate">
                {request.category}
             </span>
             {request.urgency === 'Crítica' && (
                <span className="flex items-center text-[9px] font-black text-red-500 animate-pulse">
                    <Zap size={10} className="mr-0.5" /> CRÍTICA
                </span>
             )}
          </div>
          
          <h3 className="font-extrabold text-gray-900 text-base leading-tight truncate">
            {request.title}
          </h3>
          
          <div className="flex items-center text-gray-400 text-[11px] mt-1">
            <MapPin size={10} className="mr-1 flex-shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex justify-between items-end mb-2">
           <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Arrecadado</span>
              <span className="text-sm font-extrabold text-black">R$ {request.amountRaised.toLocaleString('pt-BR')}</span>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Meta</span>
              <span className="text-xs font-bold text-gray-600">R$ {request.amountNeeded.toLocaleString('pt-BR')}</span>
           </div>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-black rounded-full transition-all duration-1000" 
            style={{ width: `${percentRaised}%` }}
          ></div>
        </div>
      </div>

      {!minimal && (
        <div className="px-5 pb-5 pt-0 flex flex-col gap-3">
             <div className="flex gap-2">
                <Button 
                    variant={showDonate ? "secondary" : "black"} 
                    size="md" 
                    fullWidth 
                    onClick={() => setShowDonate(!showDonate)}
                >
                    {showDonate ? 'Fechar' : 'Doar Agora'}
                </Button>
                
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-black/5"
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
             </div>

             {isExpanded && (
                 <div className="text-sm text-gray-600 space-y-4 py-2 animate-app-in">
                    <p className="leading-relaxed text-xs">{request.description}</p>
                 </div>
             )}

            {showDonate && (
                <div className="animate-app-in space-y-3 pt-2">
                    <input 
                        type="number" 
                        className="w-full bg-gray-50 border border-black/5 rounded-2xl px-4 py-3 font-bold text-lg outline-none focus:ring-2 focus:ring-black"
                        placeholder="R$ 0,00"
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(e.target.value)}
                    />
                    <Button onClick={handleDonate} disabled={!donateAmount} variant="black" fullWidth>
                        <CreditCard size={18} className="mr-2" /> Confirmar Pix
                    </Button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default RequestCard;