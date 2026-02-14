
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, isLoading } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar. Verifique seus dados.');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF5] p-8 flex flex-col pt-safe animate-app-in">
      <header className="mb-10">
        <button 
          onClick={() => navigate('/onboarding', { replace: true })} 
          className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm mb-10 border border-black/5 active:scale-90 transition-transform"
        >
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-4xl font-extrabold text-black tracking-tighter leading-[0.9] mb-3">Bem-vindo<br/>de volta</h2>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Acesse sua conta AjudaJá</p>
      </header>

      <form onSubmit={handleLogin} className="space-y-5 flex-1">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-bold border border-red-100 animate-pulse uppercase tracking-tight leading-tight">
            {error}
          </div>
        )}
        
        <div className="space-y-1.5">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">E-mail</label>
           <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-black/5 rounded-2xl p-5 pl-12 text-sm font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
              />
           </div>
        </div>
        
        <div className="space-y-1.5">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Senha</label>
           <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-black/5 rounded-2xl p-5 pl-12 pr-12 text-sm font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-14"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
           </div>
        </div>

        <div className="pt-6">
            <Button fullWidth size="lg" type="submit" isLoading={isLoading} variant="black" className="h-16 shadow-xl">
                Entrar
            </Button>
        </div>

        <div className="text-center pt-4 pb-10">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-tight">
                Ainda não tem conta? <Link to="/tipo-conta" className="text-black font-black underline underline-offset-4">Cadastre-se</Link>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
