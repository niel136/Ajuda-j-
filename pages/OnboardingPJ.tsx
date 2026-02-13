
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, Building, Hash, Phone, Users, Landmark } from 'lucide-react';

const OnboardingPJ: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useApp();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    segmento: '',
    employees: '',
    faturamento: '',
    responsavel: '',
    email: '',
    password: '',
    telefone: ''
  });

  const validateCNPJ = (cnpj: string) => {
    const clean = cnpj.replace(/\D/g, '');
    return clean.length === 14;
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !validateCNPJ(formData.cnpj))) {
      alert("Por favor, informe o nome e um CNPJ válido.");
      return;
    }
    setStep(step + 1);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, formData.name, 'PJ', formData);
      navigate('/welcome');
    } catch (e) {
      alert("Erro ao cadastrar empresa.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col pt-safe">
      <header className="mb-10 flex items-center gap-4">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/tipo-conta')} className="p-2 bg-white rounded-xl shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Onboarding PJ</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passo {step} de 2</p>
        </div>
      </header>

      <form onSubmit={handleFinish} className="flex-1 flex flex-col gap-6">
        {step === 1 ? (
          <div className="space-y-4 animate-app-in">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razão Social</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required placeholder="Nome da Empresa" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-14 bg-white rounded-2xl border border-slate-200 pl-12 pr-4 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="w-full h-14 bg-white rounded-2xl border border-slate-200 pl-12 pr-4 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Funcionários</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input placeholder="Ex: 50" type="number" value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} className="w-full h-14 bg-white rounded-2xl border border-slate-200 pl-12 pr-4 font-bold text-slate-900 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faturamento</label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input placeholder="Mensal R$" value={formData.faturamento} onChange={e => setFormData({...formData, faturamento: e.target.value})} className="w-full h-14 bg-white rounded-2xl border border-slate-200 pl-12 pr-4 font-bold text-slate-900 outline-none" />
                </div>
              </div>
            </div>
            
            <Button fullWidth variant="black" size="lg" className="mt-6 bg-indigo-600 h-16" type="button" onClick={handleNext}>Continuar</Button>
          </div>
        ) : (
          <div className="space-y-4 animate-app-in">
             <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <input required type="email" placeholder="financeiro@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-14 bg-white rounded-2xl border border-slate-200 px-6 font-bold text-slate-900 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <input required type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-14 bg-white rounded-2xl border border-slate-200 px-6 font-bold text-slate-900 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required placeholder="(00) 00000-0000" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full h-14 bg-white rounded-2xl border border-slate-200 pl-12 pr-4 font-bold text-slate-900 outline-none" />
              </div>
            </div>
            <Button fullWidth variant="black" size="lg" className="mt-6 bg-indigo-600 h-16" isLoading={isLoading} type="submit">Concluir Cadastro</Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingPJ;
