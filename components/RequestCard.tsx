import React, { useState } from 'react';
import { HelpRequest } from '../types';
import { MapPin, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';
import { useApp } from '../context/AppContext';

const RequestCard: React.FC<{ request: HelpRequest; minimal?: boolean }> = ({ request, minimal = false }) => {
  const { addDonation } = useApp();
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const percentRaised = Math.min(100, Math.round((request.amountRaised / request.amountNeeded) * 100));
  
  const handleDonate = () => {
    if (!donateAmount) return;
    addDonation(request.id, Number(donateAmount));
    setDonateAmount('');
    setShowDonate(false);
  };

  return (
    <div className="bg-white rounded-[2rem] p-4 shadow-sm mb-4 border border-white/40">
      <div className="flex gap-4">
        {/* Image - Rounded Square */}
        <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
          <img src={request.imageUrl} alt={request.title} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E2F687] px-2 py-1 rounded-md text-gray-900">
                {request.category}
             </span>
             {request.status === 'Concluído' && <CheckCircle size={16} className="text-green-600" />}
          </div>
          
          <h3 className="font-bold text-gray-900 leading-tight mt-1 truncate">{request.title}</h3>
          
          <div className="flex items-center text-gray-500 text-xs mt-1 truncate">
            <MapPin size={12} className="mr-1" />
            {request.location}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5 font-bold">
           <span>R$ {request.amountRaised}</span>
           <span className="text-gray-400">meta R$ {request.amountNeeded}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gray-900 rounded-full transition-all duration-500" 
            style={{ width: `${percentRaised}%` }}
          ></div>
        </div>
      </div>

      {!minimal && (
        <div className="mt-4 pt-4 border-t border-gray-100">
             <div className="flex gap-2">
                <Button 
                    variant={showDonate ? "secondary" : "black"} 
                    size="sm" 
                    fullWidth 
                    onClick={() => setShowDonate(!showDonate)}
                >
                    {showDonate ? 'Cancelar' : 'Ajudar'}
                </Button>
                
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600"
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
             </div>

             {/* Expanded Content */}
             {isExpanded && (
                 <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl">
                     <p className="mb-3">{request.description}</p>
                     
                     {request.updates.length > 0 && (
                         <div className="border-t border-gray-200 pt-3 mt-3">
                             <p className="font-bold text-gray-900 text-xs uppercase mb-2">Linha do tempo</p>
                             {request.updates.map(u => (
                                 <div key={u.id} className="text-xs mb-2 pl-2 border-l-2 border-gray-900">
                                     <span className="text-gray-400 block">{new Date(u.date).toLocaleDateString()}</span>
                                     {u.text}
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
             )}

            {/* Donation Input */}
            {showDonate && (
                <div className="mt-3 animate-fadeIn">
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            className="bg-gray-100 border-0 rounded-xl px-4 py-2 w-full font-bold focus:ring-2 focus:ring-black"
                            placeholder="R$ 0,00"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.value)}
                            autoFocus
                        />
                        <Button onClick={handleDonate} disabled={!donateAmount} size="sm">
                            Pix
                        </Button>
                    </div>
                    <p className="text-[10px] text-center text-gray-400 mt-2">Pagamento seguro via Banco Central</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default RequestCard;