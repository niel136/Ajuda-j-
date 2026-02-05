
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Sparkles, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { enhanceDescription } from '../services/geminiService';

const CreateRequest: React.FC = () => {
  const { user, addRequest } = useApp();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [description, setDescription] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (description.length < 10) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const enhanced = await enhanceDescription(description, category);
      setDescription(enhanced);
    } catch (e) {
      console.warn("IA enhancement failed", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Você precisa estar logado para publicar.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await addRequest({
        title,
        category,
        amountNeeded: Number(amount),
        pixKey,
        description,
      });
      navigate('/feed');
    } catch (err: any) {
      console.error("Submit error", err);
      setError(err.message || "Erro ao publicar pedido. Verifique sua conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-2 animate-app-in">
      <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Novo Pedido</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
          </div>
        )}

        <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">O que você precisa?</label>
              <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-black/5 bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
                  placeholder="Ex: Reforma do Telhado"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Meta R$</label>
                  <input 
                      type="number" 
                      required
                      placeholder="Meta R$"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full rounded-2xl border border-black/5 bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Categoria</label>
                  <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full rounded-2xl border border-black/5 bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14 appearance-none"
                  >
                      <option>Alimentação</option>
                      <option>Saúde</option>
                      <option>Reforma</option>
                      <option>Educação</option>
                      <option>Outros</option>
                  </select>
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Sua Chave Pix</label>
              <input 
                  type="text" 
                  required
                  placeholder="Chave para receber doações"
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  className="w-full rounded-2xl border border-black/5 bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
              />
            </div>

            <div className="space-y-1 relative">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">História Detalhada</label>
                <textarea 
                    required
                    rows={6}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 bg-white p-4 font-medium shadow-sm focus:ring-2 focus:ring-black outline-none text-base"
                    placeholder="Conte como essa ajuda fará a diferença..."
                />
                <button 
                  type="button" 
                  onClick={handleEnhance}
                  disabled={isEnhancing || description.length < 5}
                  className="absolute bottom-4 right-4 bg-black text-[#E2F687] px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg active:scale-95 disabled:opacity-30 transition-all"
                >
                  <Sparkles size={12} className={isEnhancing ? 'animate-spin' : ''} /> {isEnhancing ? 'Melhorando...' : 'Melhorar com IA'}
                </button>
            </div>
        </div>

        <Button 
          fullWidth 
          type="submit" 
          size="lg" 
          variant="black" 
          className="h-16 shadow-2xl"
          isLoading={isSubmitting}
        >
            <Send size={18} className="mr-2" /> Publicar Urgência
        </Button>
      </form>
    </div>
  );
};

export default CreateRequest;
