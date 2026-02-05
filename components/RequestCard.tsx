
import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp, CreditCard, Share2, CheckCircle2, DollarSign } from 'lucide-react';
import Button from './Button';
import MascotAvatar from './MascotAvatar';
import { useApp } from '../context/AppContext';

const RequestCard: React.FC<{ request: any; minimal?: boolean }> = ({ request, minimal = false }) => {
  const { addDonation } = useApp();
  const [showDonate, setShowDonate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const valorMeta = Number(request.valor_meta) || 1;
  const valorArrecadado = Number(request.valor_arrecadado) || 0;
  const percentRaised = Math.min(100, Math.round((valorArrecadado / valorMeta) * 100));

  const handleCopyPix = () => {
    navigator.clipboard.writeText(request.pix_key || '');
    alert('Chave Pix copiada com sucesso! Após fazer a transferência, confirme aqui para atualizar o progresso.');
  };

  const handleConfirmDonation = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert('Por favor, insira um valor válido para confirmar sua doação.');
      return;
    }

    setIsProcessing(true);
    try {
      await addDonation(request.id, value);
      setConfirming(false);
      setAmount('');
      setShowDonate(false);
      alert('Doação registrada com sucesso! Obrigado por ajudar.');
    } catch (e) {
      alert('Erro ao registrar doação. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden animate-app-in">
      <div className="p-5 flex gap-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-50 border border-black/5">
          <img 
            src={`https://picsum.photos/400/300?seed=${request.id}`} 
            alt={request.titulo} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#E2F687] self-start px-2 py-0.5 rounded-lg text-black mb-2">
            {request.categoria || 'Geral'}
          </span>
          
          <h3 className="font-extrabold text-gray-900 text-lg leading-tight truncate">
            {request.titulo}
          </h3>
          
          <div className="flex items-center text-gray-400 text-xs mt-1 font-bold">
            {request.profiles?.avatar_url ? (
              <img src={request.profiles.avatar_url} className="w-4 h-4 rounded-full mr-1 object-cover" alt="" />
            ) : (
              <MascotAvatar seed={request.profiles?.avatar_seed || request.user_id} size={16} className="mr-1 rounded-full border-none bg-transparent" />
            )}
            <MapPin size={10} className="mr-0.5 flex-shrink-0" />
            <span className="truncate">{request.profiles?.nome || 'Anônimo'}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-1">
        <div className="flex justify-between items-end mb-3">
           <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Arrecadado</span>
              <span className="text-base font-extrabold text-black">R$ {valorArrecadado.toLocaleString('pt-BR')}</span>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Meta</span>
              <span className="text-sm font-bold text-gray-500">R$ {valorMeta.toLocaleString('pt-BR')}</span>
           </div>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-5">
          <div 
            className="h-full bg-black rounded-full transition-all duration-700" 
            style={{ width: `${percentRaised}%` }}
          ></div>
        </div>

        {!minimal && (
          <div className="flex flex-col gap-3">
             <div className="flex gap-2">
                <Button 
                    variant={showDonate ? "secondary" : "black"} 
                    fullWidth 
                    onClick={() => {
                      setShowDonate(!showDonate);
                      setConfirming(false);
                    }}
                >
                    {showDonate ? 'Fechar' : 'Quero Ajudar'}
                </Button>
                
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-[1.5rem] bg-gray-50 text-gray-400 border border-black/5 active:scale-95 transition-all"
                >
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
             </div>

             {isExpanded && (
                 <div className="text-sm text-gray-500 space-y-4 py-3 animate-app-in leading-relaxed">
                    <p className="font-medium text-xs whitespace-pre-wrap">{request.descricao}</p>
                 </div>
             )}

            {showDonate && (
                <div className="animate-app-in space-y-4 pt-4 border-t border-black/5">
                    {!confirming ? (
                      <>
                        <div className="bg-gray-50 p-5 rounded-2xl flex flex-col items-center border border-black/5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Escaneie ou copie a Chave Pix</span>
                            <p className="font-black text-sm text-center break-all select-all text-black bg-white p-4 rounded-xl border border-black/5 w-full shadow-sm">
                              {request.pix_key || 'Chave não disponível'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <Button variant="primary" fullWidth onClick={handleCopyPix} className="h-14">
                                <CreditCard size={18} className="mr-2" /> Copiar Chave
                            </Button>
                            <Button variant="black" fullWidth onClick={() => setConfirming(true)} className="h-14 bg-gray-900">
                                <CheckCircle2 size={18} className="mr-2 text-[#E2F687]" /> Já fiz o Pix, confirmar!
                            </Button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-[#F8FAF5] p-6 rounded-3xl border border-black/10 animate-app-in">
                        <div className="flex items-center gap-2 mb-4">
                           <DollarSign size={20} className="text-green-600" />
                           <h4 className="font-black text-black uppercase text-[10px] tracking-widest">Quanto você doou?</h4>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            autoFocus
                            placeholder="R$ 0,00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="flex-1 bg-white border border-black/5 rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-black"
                          />
                          <Button 
                            variant="black" 
                            isLoading={isProcessing}
                            onClick={handleConfirmDonation}
                            className="px-8 rounded-2xl h-auto"
                          >
                            Ok
                          </Button>
                        </div>
                        <button 
                          onClick={() => setConfirming(false)}
                          className="mt-4 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                        >
                          Voltar
                        </button>
                      </div>
                    )}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
