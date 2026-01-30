import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login, isLoading } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    setTimeout(() => navigate('/'), 800);
  };

  return (
    <div className="min-h-screen bg-white rounded-t-[3rem] mt-20 p-8 shadow-2xl animate-slideUp">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/onboarding')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold ml-2">Identifique-se</h2>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
           <label className="block text-sm font-bold text-gray-900 mb-2">E-mail ou Telefone</label>
           <input
            type="email"
            required
            placeholder="ex: maria@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-lg font-medium focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        
        <div>
           <label className="block text-sm font-bold text-gray-900 mb-2">Senha</label>
           <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-lg font-medium focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <div className="pt-4">
            <Button fullWidth size="lg" type="submit" isLoading={isLoading} variant="black">
                Entrar
            </Button>
        </div>
      </form>

      <div className="mt-8 text-center space-y-4">
        <p className="text-sm text-gray-500">
            Ainda não tem conta? <button className="font-bold text-gray-900 underline">Criar agora</button>
        </p>
        <div className="text-xs text-gray-400 bg-gray-50 p-4 rounded-xl">
          <p>Admin Demo: admin@ajudaja.org</p>
          <p>User Demo: qualquer email</p>
        </div>
      </div>
    </div>
  );
};

export default Login;