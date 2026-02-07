
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm mb-10 border border-black/5 active:scale-90 transition-transform"
        >
            <ArrowLeft size={28} />
        </button>
        <h2 className="text-4xl font-extrabold text-black tracking-tighter leading-none">Bem-vindo<br/>de volta</h2>
        <p className="text-gray-400 font-bold mt-3 text-sm uppercase tracking-widest">Acesse sua conta AjudaJá</p>
      </header>

      <div className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          fullWidth 
          size="lg" 
          className="bg-white border-black/5 shadow-sm flex items-center gap-3 h-16 rounded-[2rem]"
          onClick={loginWithGoogle}
          isLoading={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.8c2.2-2.1 3.6-5.2 3.6-8.7z" fill="#4285F4"/>
            <path d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3c-1.1.8-2.6 1.2-4.2 1.2-3.2 0-6-2.2-7-5.2H1.1v3.1C3.1 21.4 7.2 24 12 24z" fill="#34A853"/>
            <path d="M5 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V6.8H1.1C.4 8.4 0 10.2 0 12s.4 3.6 1.1 5.2l3.9-3.1z" fill="#FBBC05"/>
            <path d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.2 0 3.1 2.6 1.1 6.8l3.9 3.1c1-3 3.8-5.1 7-5.1z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </Button>

        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-[1px] bg-black/5"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">ou e-mail</span>
          <div className="flex-1 h-[1px] bg-black/5"></div>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-6 flex-1">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-pulse">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">E-mail</label>
           <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-black/5 rounded-3xl p-5 pl-14 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-16"
              />
           </div>
        </div>
        
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Senha</label>
           <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-black/5 rounded-3xl p-5 pl-14 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-16"
              />
           </div>
        </div>

        <div className="pt-6">
            <Button fullWidth size="lg" type="submit" isLoading={isLoading} variant="black">
                Entrar
            </Button>
        </div>

        <div className="text-center pt-4 pb-10">
            <p className="text-gray-400 font-bold text-sm">
                Ainda não tem conta? <Link to="/tipo-conta" className="text-black underline decoration-2">Cadastre-se</Link>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
