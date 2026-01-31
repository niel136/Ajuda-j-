import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { register, isLoading } = useApp();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email);
    setTimeout(() => navigate('/tipo-conta'), 800);
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF5] p-7 flex flex-col pt-safe">
      <header className="mb-10">
        <button onClick={() => navigate('/login')} className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm btn-active mb-8 border border-black/5">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-4xl font-extrabold text-black tracking-tighter">Criar Conta</h2>
        <p className="text-gray-400 font-medium mt-2">Junte-se à maior rede de solidariedade.</p>
      </header>

      <form onSubmit={handleSignup} className="space-y-5 flex-1 animate-app-in">
        <div className="space-y-2">
           <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Nome Completo</label>
           <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="text"
                required
                placeholder="Maria Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">E-mail</label>
           <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
           </div>
        </div>
        
        <div className="space-y-2">
           <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Crie uma Senha</label>
           <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="password"
                placeholder="No mínimo 6 caracteres"
                className="w-full bg-white border border-black/5 rounded-2xl p-4 pl-12 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
           </div>
        </div>

        <div className="pt-4">
            <Button fullWidth size="lg" type="submit" isLoading={isLoading} variant="black" className="h-16">
                Criar Minha Conta
            </Button>
        </div>

        <div className="text-center pt-4">
            <p className="text-gray-400 font-bold text-sm">
                Já possui conta? <Link to="/login" className="text-black underline">Entrar agora</Link>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;