
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Heart, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

const DonationHistory: React.FC = () => {
  const navigate = useNavigate();
  const { donations, fetchDonations, isLoading } = useApp();

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="pt-2 animate-app-in flex flex-col min-h-full">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/perfil')} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active transition-all">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Meu Histórico</h2>
      </div>

      <div className="space-y-4 pb-20">
        {donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-extrabold text-black tracking-tight">Nenhuma doação ainda</h3>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 leading-relaxed">
              Explore o feed e ajude sua primeira família hoje mesmo.
            </p>
          </div>
        ) : (
          donations.map((donation) => (
            <div 
              key={donation.id} 
              className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E2F687] rounded-xl flex items-center justify-center text-black shadow-sm">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 leading-tight">
                      {donation.pedidos_ajuda?.titulo || 'Pedido de Ajuda'}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Calendar size={12} />
                        {new Date(donation.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest">
                        <DollarSign size={12} />
                        Confirmado
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xl font-black text-black">
                  R$ {donation.valor.toLocaleString('pt-BR')}
                </div>
              </div>
              
              <button className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2 group-hover:text-black transition-colors self-start">
                Ver detalhes do pedido <ExternalLink size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      <footer className="mt-auto pb-10 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Suas doações transformam vidas reais
        </p>
      </footer>
    </div>
  );
};

export default DonationHistory;
