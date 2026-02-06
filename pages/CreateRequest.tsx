
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Sparkles, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { enhanceDescription } from '../services/geminiService';

const CreateRequest: React.FC = () => {
  const { saveDraft } = useApp();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [description, setDescription] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEnhance = async () => {
    if (description.length < 10) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceDescription(description, category);
      setDescription(enhanced);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveDraft({
        titulo: title,
        categoria: category,
        valor_meta: Number(amount),
        pix_key: pixKey,
        descricao: description,
        data_limite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      navigate('/perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-2 animate-app-in">
      <header className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active"><ArrowLeft size={24} /></button>
          <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Criar Pedido</h2>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100 mb-6">
          <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <p className="text-[11px] text-blue-700 font-bold leading-tight uppercase tracking-tight">
            Seu pedido será salvo como RASCUNHO. Após salvar, você poderá enviá-lo para análise da nossa equipe no seu perfil.
          </p>
        </div>

        <div className="space-y-4">
            <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-black/5 p-5 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-16"
                placeholder="Título do Pedido"
            />

            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="number" required
                    placeholder="Meta R$"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 p-5 font-bold shadow-sm h-16 outline-none"
                />
                <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 p-5 font-bold shadow-sm h-16 outline-none appearance-none"
                >
                    <option>Alimentação</option>
                    <option>Saúde</option>
                    <option>Reforma</option>
                    <option>Educação</option>
                </select>
            </div>

            <input 
                required
                placeholder="Sua Chave Pix"
                value={pixKey}
                onChange={e => setPixKey(e.target.value)}
                className="w-full rounded-2xl border border-black/5 p-5 font-bold shadow-sm h-16 outline-none"
            />

            <div className="relative">
                <textarea 
                    required rows={6}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 p-5 font-medium shadow-sm outline-none text-base"
                    placeholder="Conte sua história..."
                />
                <button 
                  type="button" onClick={handleEnhance}
                  disabled={isEnhancing || description.length < 5}
                  className="absolute bottom-4 right-4 bg-black text-[#E2F687] px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-95 disabled:opacity-30 transition-all shadow-lg"
                >
                  <Sparkles size={12} className={isEnhancing ? 'animate-spin' : ''} /> IA: Melhorar
                </button>
            </div>
        </div>

        <Button fullWidth type="submit" size="lg" variant="black" className="h-16" isLoading={isSaving}>
            <Save size={20} className="mr-2" /> Salvar Rascunho
        </Button>
      </form>
    </div>
  );
};

export default CreateRequest;
