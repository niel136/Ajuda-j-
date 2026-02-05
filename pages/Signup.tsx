
import React, { useState } from 'react';
// Consolidated imports to ensure correct resolution of exported members
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';

const Signup: React.FC = () => {
  const { register, isLoading } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const role = localStorage.getItem('ajudaJa_pending_role') || 'donor';
      await register(email, password, name, role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF5] p-8 flex flex-col pt-safe">
      <header className="mb-10">
        <button onClick={() => navigate('/tipo-conta')} className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm mb-10 border border-black/5">
            <ArrowLeft size={28} />
        </button>
        <h2 className="text-4xl font-extrabold text-black tracking-tighter leading-none">Criar sua<br/>Conta</h2>
        <p className="text-gray-400 font-bold mt-3 text-sm uppercase tracking-widest">Rápido e Seguro</p>
      </header>

      <form onSubmit={handleSignup} className="space-y-6 flex-1 animate-app-in">
        {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold">{error}</div>}
        
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome Completo</label>
           <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input type="text" required placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-black/5 rounded-3xl p-5 pl-14 text-base font-bold shadow-sm h-16 focus:ring-2 focus:ring-black outline-none" />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">E-mail</label>
           <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input type="email" required placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-black/5 rounded-3xl p-5 pl-14 text-base font-bold shadow-sm h-16 focus:ring-2 focus:ring-black outline-none" />
           </div>
        </div>
        
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Senha</label>
           <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input type="password" required placeholder="Mínimo 6 dígitos" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-black/5 rounded-3xl p-5 pl-14 text-base font-bold shadow-sm h-16 focus:ring-2 focus:ring-black outline-none" />
           </div>
        </div>

        <div className="pt-6">
            <Button fullWidth size="lg" type="submit" isLoading={isLoading} variant="black">
                Concluir Cadastro
            </Button>
        </div>

        <div className="text-center pt-4">
            <p className="text-gray-400 font-bold text-sm">
                Já tem conta? <Link to="/login" className="text-black underline decoration-2">Fazer Login</Link>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;