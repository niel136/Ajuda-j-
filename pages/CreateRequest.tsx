import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { Sparkles, ArrowLeft, Camera, Info } from 'lucide-react';
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
      location: location || user.city,
      urgency,
      pixKey,
      description,
      imageUrl: 'https://picsum.photos/800/600?random=' + Math.random(), 
    });
    navigate('/feed');
  };

  return (
    <div className="pt-6 px-1 pb-20 max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-3 -ml-3 rounded-full hover:bg-white/50 transition-colors">
            <ArrowLeft size={28} />
          </button>
          <h2 className="text-3xl font-extrabold text-gray-900 ml-2 tracking-tight">Novo Pedido</h2>
      </div>
      
      {/* Mascote de Apoio */}
      <div className="bg-white rounded-[2rem] p-4 border border-black/5 mb-8 flex items-center gap-4 animate-app-in">
        <div className="w-16 h-16 shrink-0 relative">
            <img 
              src="https://i.postimg.cc/15FXPBTV/20260202-061509.png" 
              alt="Mascote" 
              className="w-full h-auto drop-shadow-lg"
            />
        </div>
        <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Guia AjudaJá</p>
            <p className="text-xs font-bold text-black leading-tight">
              "Não tenha receio de pedir. Quanto mais detalhes você der, mais fácil será de as pessoas ajudarem você!"
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 animate-app-in" style={{ animationDelay: '0.1s' }}>
        
        {/* Upload */}
        <div className="w-full h-48 sm:h-64 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-white transition-all group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                <Camera size={32} className="text-gray-900" />
            </div>
            <span className="text-sm font-bold text-gray-900 text-center">Adicionar Foto ou Vídeo</span>
            <span className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-widest">Aumenta chances em 4x</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Título do Pedido</label>
                <input 
                    type="text" 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full rounded-2xl border-none bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black text-lg h-14"
                    placeholder="Ex: Reforma do telhado"
                />
            </div>

            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Meta (R$)</label>
                <input 
                    type="number" 
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-2xl border-none bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black h-14"
                    placeholder="0,00"
                />
            </div>

            <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Chave Pix</label>
                <input 
                    type="text" 
                    required
                    value={pixKey}
                    onChange={e => setPixKey(e.target.value)}
                    className="w-full rounded-2xl border-none bg-white p-4 font-bold shadow-sm focus:ring-2 focus:ring-black h-14"
                    placeholder="CPF ou E-mail"
                />
            </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ml-2">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Sua História</label>
            <button 
              type="button" 
              onClick={handleEnhance}
              disabled={isEnhancing || description.length < 5}
              className="text-[10px] flex items-center bg-black text-[#E2F687] px-4 py-2 rounded-full shadow-lg font-black uppercase tracking-widest disabled:opacity-50 hover:scale-105 transition-transform"
            >
              <Sparkles size={14} className="mr-2" />
              {isEnhancing ? 'Processando...' : 'Aprimorar com IA'}
            </button>
          </div>
          <textarea 
            required
            rows={6}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-3xl border-none bg-white p-5 font-medium shadow-sm focus:ring-2 focus:ring-black text-base leading-relaxed"
            placeholder="Conte o que aconteceu e como a ajuda será usada..."
          />
        </div>

        <div className="pt-6">
          <Button fullWidth type="submit" size="lg" variant="black" className="h-16 text-lg">Publicar Pedido</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;