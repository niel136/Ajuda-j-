import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Sparkles, ArrowLeft, Camera } from 'lucide-react';
import { enhanceDescription } from '../services/geminiService';
import { RequestCategory, RequestUrgency } from '../types';

const CreateRequest: React.FC = () => {
  const { user, addRequest } = useApp();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RequestCategory>('Outros');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<RequestUrgency>('Média');
  const [pixKey, setPixKey] = useState('');
  const [description, setDescription] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-4">Você precisa entrar para pedir ajuda.</h2>
        <Button onClick={() => navigate('/login')} variant="black">Fazer Login</Button>
      </div>
    );
  }

  const handleEnhance = async () => {
    if (description.length < 10) return;
    setIsEnhancing(true);
    const enhanced = await enhanceDescription(description, category);
    setDescription(enhanced);
    setIsEnhancing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      userId: user.id,
      userName: user.name,
      title,
      category,
      amountNeeded: Number(amount),
      location,
      urgency,
      pixKey,
      description,
      imageUrl: 'https://picsum.photos/800/600?random=' + Math.random(), 
    });
    navigate('/feed');
  };

  return (
    <div className="pt-6 px-4 pb-20 max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-3 -ml-3 rounded-full hover:bg-white/50 transition-colors">
            <ArrowLeft size={28} />
          </button>
          <h2 className="text-3xl font-extrabold text-gray-900 ml-2 tracking-tight">Novo Pedido</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Upload responsivo */}
        <div className="w-full h-48 sm:h-64 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-white transition-all group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                <Camera size={32} className="text-gray-900" />
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-900">Adicionar Foto ou Vídeo</span>
            <span className="text-xs text-gray-400 mt-1">Imagens reais aumentam as chances de doação em 4x</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2 ml-1">Título do Pedido</label>
                <input 
                    type="text" 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full rounded-2xl border-none bg-white p-4 font-medium shadow-sm focus:ring-2 focus:ring-black text-lg"
                    placeholder="Ex: Reforma urgente do telhado"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Categoria</label>
                <div className="relative">
                    <select 
                    value={category}
                    onChange={e => setCategory(e.target.value as RequestCategory)}
                    className="w-full rounded-2xl border-none bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black appearance-none"
                    >
                    <option value="Alimentação">Alimentação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Reforma">Reforma</option>
                    <option value="Educação">Educação</option>
                    <option value="Outros">Outros</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Urgência</label>
                <div className="relative">
                    <select 
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as RequestUrgency)}
                    className="w-full rounded-2xl border-none bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black appearance-none"
                    >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Meta Financeira (R$)</label>
                <input 
                    type="number" 
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-2xl border-none bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black"
                    placeholder="0,00"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 ml-1">Sua Chave Pix</label>
                <input 
                    type="text" 
                    required
                    value={pixKey}
                    onChange={e => setPixKey(e.target.value)}
                    className="w-full rounded-2xl border-none bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black"
                    placeholder="CPF, E-mail ou Telefone"
                />
            </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="block text-sm font-bold text-gray-900">Sua História</label>
            <button 
              type="button" 
              onClick={handleEnhance}
              disabled={isEnhancing || description.length < 5}
              className="text-xs flex items-center bg-black text-[#E2F687] px-3 py-1.5 rounded-full shadow-lg font-bold disabled:opacity-50 hover:scale-105 transition-transform"
            >
              <Sparkles size={14} className="mr-1.5" />
              {isEnhancing ? 'Aprimorando...' : 'Aprimorar com IA'}
            </button>
          </div>
          <textarea 
            required
            rows={6}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-2xl border-none bg-white p-4 font-medium shadow-sm focus:ring-2 focus:ring-black text-base leading-relaxed"
            placeholder="Conte detalhadamente o que aconteceu e como a ajuda será utilizada..."
          />
        </div>

        <div className="pt-6">
          <Button fullWidth type="submit" size="lg" variant="black" className="py-5 text-lg">Publicar Pedido de Ajuda</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;