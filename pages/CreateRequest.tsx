
import React, { useState } from 'react';
// Consolidated imports to ensure correct resolution of exported members
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Sparkles, ArrowLeft, Send } from 'lucide-react';
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

  const handleEnhance = async () => {
    if (description.length < 10) return;
    setIsEnhancing(true);
    const enhanced = await enhanceDescription(description, category);
    setDescription(enhanced);
    setIsEnhancing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRequest({
      title,
      category,
      amountNeeded: Number(amount),
      pixKey,
      description,
    });
    navigate('/feed');
  };

  return (
    <div className="pt-2">
      <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-black/5">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Novo Pedido</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
            <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-black/5 bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
                placeholder="Título do seu pedido"
            />

            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="number" 
                    required
                    placeholder="Meta R$"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
                />
                <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
                >
                    <option>Alimentação</option>
                    <option>Saúde</option>
                    <option>Reforma</option>
                    <option>Outros</option>
                </select>
            </div>

            <input 
                type="text" 
                required
                placeholder="Chave Pix para doação"
                value={pixKey}
                onChange={e => setPixKey(e.target.value)}
                className="w-full rounded-2xl border border-black/5 bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
            />

            <div className="relative">
                <textarea 
                    required
                    rows={5}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 bg-white p-4 font-medium shadow-sm focus:ring-2 focus:ring-black outline-none text-base"
                    placeholder="Conte sua história..."
                />
                <button 
                  type="button" 
                  onClick={handleEnhance}
                  disabled={isEnhancing || description.length < 5}
                  className="absolute bottom-4 right-4 bg-black text-[#E2F687] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg"
                >
                  <Sparkles size={12} /> {isEnhancing ? 'IA...' : 'Melhorar com IA'}
                </button>
            </div>
        </div>

        <Button fullWidth type="submit" size="lg" variant="black" className="h-16">
            <Send size={18} className="mr-2" /> Publicar Agora
        </Button>
      </form>
    </div>
  );
};

export default CreateRequest;