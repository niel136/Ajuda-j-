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
    <div className={`bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-white/40 flex flex-col h-full ${isExpanded ? 'ring-2 ring-black/5' : ''}`}>
      <div className="flex gap-4">
        {/* Imagem Responsiva */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-100 shadow-inner">
          <img src={request.imageUrl} alt={request.title} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex justify-between items-start">
             <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-[#E2F687] px-2.5 py-1 rounded-lg text-gray-900">
                {request.category}
             </span>
             {request.status === 'Concluído' && <CheckCircle size={18} className="text-green-600" />}
          </div>
          
          <h3 className="font-extrabold text-gray-900 leading-tight mt-1.5 sm:text-lg truncate">{request.title}</h3>
          
          <div className="flex items-center text-gray-500 text-xs sm:text-sm mt-1 truncate">
            <MapPin size={14} className="mr-1 text-gray-400" />
            {request.location}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-5">
        <div className="flex justify-between text-xs sm:text-sm mb-2 font-bold">
           <span className="text-gray-900">R$ {request.amountRaised}</span>
           <span className="text-gray-400">meta R$ {request.amountNeeded}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${percentRaised}%` }}
          ></div>
        </div>
      </div>

      {!minimal && (
        <div className="mt-auto pt-5">
             <div className="flex gap-2">
                <Button 
                    variant={showDonate ? "outline" : "black"} 
                    size="md" 
                    fullWidth 
                    onClick={() => setShowDonate(!showDonate)}
                    className="rounded-2xl font-extrabold"
                >
                    {showDonate ? 'Cancelar' : 'Ajudar Agora'}
                </Button>
                
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
             </div>

             {/* Expanded Content com Animação */}
             {isExpanded && (
                 <div className="mt-4 text-sm sm:text-base text-gray-600 bg-gray-50/80 p-5 rounded-[2rem] animate-fadeIn leading-relaxed">
                     <p className="mb-4">{request.description}</p>
                     
                     {request.updates.length > 0 && (
                         <div className="border-t border-gray-200 pt-4 mt-4">
                             <p className="font-extrabold text-gray-900 text-[10px] sm:text-xs uppercase tracking-widest mb-3">Histórico de Atualizações</p>
                             <div className="space-y-3">
                                {request.updates.map(u => (
                                    <div key={u.id} className="text-xs sm:text-sm pl-3 border-l-2 border-gray-900">
                                        <span className="text-gray-400 font-bold block mb-1">{new Date(u.date).toLocaleDateString()}</span>
                                        {u.text}
                                    </div>
                                ))}
                             </div>
                         </div>
                     )}
                 </div>
             )}

            {/* Donation Input */}
            {showDonate && (
                <div className="mt-4 animate-fadeIn">
                    <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
                        <input 
                            type="number" 
                            className="bg-transparent border-none rounded-xl px-4 py-3 w-full font-bold focus:ring-0 text-lg"
                            placeholder="R$ 0,00"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.value)}
                            autoFocus
                        />
                        <Button onClick={handleDonate} disabled={!donateAmount} size="md" className="rounded-xl">
                            PIX
                        </Button>
                    </div>
                    <p className="text-[10px] text-center text-gray-400 mt-2 font-medium uppercase tracking-tighter">Transferência Instantânea e Segura</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default RequestCard;