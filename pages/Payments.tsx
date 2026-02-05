
import React from 'react';
// Corrected import to use 'react-router' to resolve missing exported members in this environment
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CreditCard, History, Plus, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/Button';

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const { donations } = useApp();

  return (
    <div className="pt-2 animate-app-in flex flex-col min-h-full">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/perfil')} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active transition-all">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Pagamentos</h2>
      </div>

      {/* METODOS DE PAGAMENTO (EM BREVE) */}
      <section className="mb-8">
         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-4">Formas de Pagamento</h3>
         <div className="bg-white rounded-[2.5rem] border border-black/5 p-6 shadow-sm border-dashed border-2 flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
               <CreditCard size={24} />
            </div>
            <h4 className="font-extrabold text-black text-sm">Adicionar Cartão</h4>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Disponível em breve</span>
         </div>
      </section>

      {/* HISTORICO DE DOAÇÕES */}
      <section className="flex-1">
         <div className="flex justify-between items-center px-2 mb-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Histórico de Apoio</h3>
            <History size={14} className="text-gray-300" />
         </div>

         <div className="space-y-4">
            {donations.length === 0 ? (
               <div className="bg-white rounded-[2.5rem] p-10 flex flex-col items-center text-center border border-black/5">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <DollarSign size={24} className="text-gray-200" />
                  </div>
                  <p className="text-sm font-extrabold text-gray-400">Nenhum pagamento realizado ainda</p>
                  <Button 
                     variant="outline" 
                     className="mt-6 border-black/10 text-gray-400 text-xs h-10 px-6 rounded-xl"
                     onClick={() => navigate('/feed')}
                  >
                     Explorar Feed
                  </Button>
               </div>
            ) : (
               donations.map((donation) => (
                  <div key={donation.id} className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                           <CheckCircle2 size={24} />
                        </div>
                        <div>
                           <h4 className="font-extrabold text-black text-sm truncate max-w-[140px]">
                              {donation.pedidos_ajuda?.titulo || 'Apoio Solidário'}
                           </h4>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {new Date(donation.created_at).toLocaleDateString('pt-BR')}
                           </span>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="text-lg font-black text-black">R$ {donation.valor.toLocaleString('pt-BR')}</span>
                        <div className="flex items-center justify-end gap-1 text-[9px] font-black text-green-500 uppercase tracking-widest">
                           Concluído
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </section>

      <footer className="mt-8 pb-10 text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
          Transações seguras via AjudaJá
        </p>
      </footer>
    </div>
  );
};

export default Payments;
