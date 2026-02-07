
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Sparkles, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { enhanceDescription } from '../services/geminiService';

const CreateRequest: React.FC = () => {
  const { saveRequest, user } = useApp();
  const navigate = useNavigate();
  
  // States do formulário
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [description, setDescription] = useState('');
  
  // States de fluxo
  const [step, setStep] = useState<'info' | 'success'>('info');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setError(null);

    try {
      await saveRequest({
        titulo: title,
        categoria: category,
        valor_meta: Number(amount),
        pix_key: pixKey,
        descricao: description,
        data_limite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        score_confianca_ia: 100 // Default para publicação direta
      });

      setStep('success');
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao enviar pedido.");
    } finally {
      setIsSaving(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8 animate-app-in">
        <div className="w-24 h-24 bg-[#E2F687] rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-[#E2F687]/20">
            <CheckCircle2 size={48} className="text-black" />
        </div>
        <h2 className="text-3xl font-black text-black tracking-tighter mb-4 leading-tight">
          🎉 Pedido enviado com sucesso
        </h2>
        <p className="text-gray-500 font-bold text-sm leading-relaxed mb-10 max-w-xs">
          Seu pedido já está visível para receber apoio.
        </p>
        <Button fullWidth variant="black" size="lg" onClick={() => navigate('/')}>
          Voltar para Home
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-2 animate-app-in">
      <header className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active"><ArrowLeft size={24} /></button>
          <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Criar Pedido</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100 mb-6">
          <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <p className="text-[11px] text-blue-700 font-bold leading-tight uppercase tracking-tight">
            Seu pedido será publicado instantaneamente e ficará visível para toda a nossa rede de doadores.
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
                    placeholder="Conte sua história com detalhes para aumentar a confiança..."
                />
                <button 
                  type="button" onClick={handleEnhance}
                  disabled={isEnhancing || description.length < 5}
                  className="absolute bottom-4 right-4 bg-black text-[#E2F687] px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-95 disabled:opacity-30 transition-all shadow-lg"
                >
                  <Sparkles size={12} className={isEnhancing ? 'animate-spin' : ''} /> IA: Melhorar Texto
                </button>
            </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
            {error}
          </div>
        )}

        <Button 
          fullWidth 
          type="submit" 
          size="lg" 
          variant="black" 
          className="h-16"
          isLoading={isSaving}
        >
            {isSaving ? 'Enviando...' : 'Enviar Pedido'}
        </Button>
      </form>
    </div>
  );
};

export default CreateRequest;
