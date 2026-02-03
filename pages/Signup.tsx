import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, Building2, FileText, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

const Signup: React.FC = () => {
  const { register, isLoading } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('donor');

  // Campos Comuns
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');

  // Campos Empresa
  const [businessName, setBusinessName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [expertise, setExpertise] = useState('');
  const [responsible, setResponsible] = useState('');

  useEffect(() => {
    const pendingRole = localStorage.getItem('ajudaJa_pending_role') as UserRole;
    if (pendingRole) setRole(pendingRole);
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const extraData = role === 'business' ? {
        businessName,
        cnpj,
        areaOfExpertise: expertise,
        responsibleContact: responsible
    } : {};

    // Aqui simulamos o registro que agora salva no localStorage
    register(name, email, role, phone, city, extraData);
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF5] p-7 flex flex-col pt-safe">
      <header className="mb-8">
        <button onClick={() => navigate('/tipo-conta')} className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm btn-active mb-6 border border-black/5">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-4xl font-extrabold text-black tracking-tighter">
            {role === 'business' ? 'Perfil Empresa' : 'Criar Conta'}
        </h2>
        <p className="text-gray-400 font-medium mt-2 leading-snug">
            {role === 'business' ? 'Fortaleça sua responsabilidade social.' : 'Preencha seus dados para começar.'}
        </p>
      </header>

      <form onSubmit={handleSignup} className="space-y-4 flex-1 animate-app-in pb-10">
        
        {/* CAMPOS PESSOA/COMUNS */}
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Nome Completo</label>
           <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="text" required placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all h-14" />
           </div>
        </div>

        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">WhatsApp</label>
           <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="tel" required placeholder="(11) 99999-9999" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all h-14" />
           </div>
        </div>

        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Cidade / Estado</label>
           <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="text" required placeholder="Ex: São Paulo, SP" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all h-14" />
           </div>
        </div>

        {/* CAMPOS EXTRAS EMPRESA */}
        {role === 'business' && (
          <div className="space-y-4 pt-2 border-t border-black/5 mt-4">
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Nome da Empresa</label>
                <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="text" required placeholder="Razão Social ou Fantasia" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all h-14" />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">CNPJ (Opcional)</label>
                <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="text" placeholder="00.000.000/0000-00" value={cnpj} onChange={e => setCnpj(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all h-14" />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Área de Atuação</label>
                <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input type="text" required placeholder="Ex: Alimentação, Tecnologia" value={expertise} onChange={e => setExpertise(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all h-14" />
                </div>
            </div>
          </div>
        )}

        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">E-mail</label>
           <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="email" required placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all h-14" />
           </div>
        </div>
        
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Senha</label>
           <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="password" required placeholder="Mínimo 6 dígitos" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all h-14" />
           </div>
        </div>

        <div className="pt-6">
            <Button fullWidth size="lg" type="submit" isLoading={isLoading} variant="black" className="h-16 text-lg">
                Finalizar Cadastro
            </Button>
        </div>

        <div className="text-center pb-8">
            <p className="text-gray-400 font-bold text-sm">
                Já tem conta? <Link to="/login" className="text-black underline">Fazer Login</Link>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;