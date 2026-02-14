
import React, { useState } from 'react';
// Fixed: Changed import source from react-router-dom to react-router
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, Heart, MapPin, Target, Send } from 'lucide-react';

const OnboardingPF: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    objetivo: '',
    cidade: '',
    interesse: '',
    frequencia: '',
    experiencia: '',
    renda: '',
    name: '',
    email: '',
    password: ''
  });

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, formData.name, 'PF', formData);
      navigate('/welcome');
    } catch (e) {
      alert("Erro ao cadastrar.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-8 flex flex-col pt-safe">
      <header className="mb-10 flex items-center gap-4">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/tipo-conta')} className="p-2 bg-white rounded-xl shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black text-black tracking-tighter">Perfil Solidário</h2>
      </header>

      <form onSubmit={handleFinish} className="flex-1 flex flex-col gap-6">
        {step === 1 ? (
          <div className="space-y-6 animate-app-in">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Seu objetivo principal?</label>
              <select value={formData.objetivo} onChange={e => setFormData({...formData, objetivo: e.target.value})} className="w-full h-14 bg-white border border-black/5 rounded-2xl px-4 font-bold outline-none">
                <option value="">Selecione...</option>
                <option value="ajudar">Quero apenas doar</option>
                <option value="pedir">Preciso de apoio</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Sua Cidade</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input placeholder="Ex: São Paulo, SP" value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} className="w-full h-14 bg-white border border-black/5 rounded-2xl pl-12 pr-4 font-bold outline-none" />
              </div>
            </div>
            <Button fullWidth variant="black" size="lg" className="h-16 mt-4" type="button" onClick={() => setStep(2)}>Próximo</Button>
          </div>
        ) : (
          <div className="space-y-6 animate-app-in">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
              <input required placeholder="Como quer ser chamado" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-14 bg-white border border-black/5 rounded-2xl px-4 font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <input required type="email" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-14 bg-white border border-black/5 rounded-2xl px-4 font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <input required type="password" placeholder="Mínimo 6 dígitos" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-14 bg-white border border-black/5 rounded-2xl px-4 font-bold outline-none" />
            </div>
            <Button fullWidth variant="black" size="lg" className="h-16 mt-4" isLoading={isLoading} type="submit">Finalizar</Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingPF;
