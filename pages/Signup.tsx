
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const { register, loginWithGoogle, isLoading } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showLoginLink, setShowLoginLink] = useState(false);

  // Validação de Senha em Tempo Real
  const passwordCriteria = useMemo(() => ({
    length: password.length >= 8 && password.length <= 70,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password), // Incluindo os sugeridos !@#%$
  }), [password]);

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowLoginLink(false);
    
    if (!isPasswordValid) return;

    try {
      await register(email, password, name, 'PF');
      navigate('/welcome');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('already registered') || msg.includes('User already exists')) {
        setError('Este e-mail já está cadastrado. Faça login para continuar ou utilize outro e-mail.');
        setShowLoginLink(true);
      } else {
        setError(err.message || 'Erro ao criar conta.');
      }
    }
  };

  const Criterion = ({ met, label }: { met: boolean; label: string }) => (
    <div className={`flex items-center gap-2 transition-colors duration-300 ${met ? 'text-emerald-500' : 'text-gray-300'}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${met ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
        {met && <Check size={10} className="text-white" strokeWidth={4} />}
      </div>
      <span className="text-[11px] font-bold tracking-tight">{label}</span>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF5] p-8 flex flex-col pt-safe animate-app-in">
      <header className="mb-8">
        <button onClick={() => navigate('/onboarding')} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm mb-6 border border-black/5 active:scale-90 transition-transform">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-black text-black tracking-tighter leading-none">Criar sua<br/>Conta</h2>
        <p className="text-gray-400 font-bold mt-2 text-[10px] uppercase tracking-widest">Sua jornada começa aqui</p>
      </header>

      <form onSubmit={handleSignup} className="space-y-5 flex-1 pb-10">
        {error && (
          <div className="p-4 bg-white border border-red-100 rounded-2xl animate-app-in shadow-sm">
            <div className="flex gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-[11px] font-bold text-red-600 leading-tight uppercase tracking-tight">{error}</p>
            </div>
            {showLoginLink && (
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="mt-3 w-full py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
              >
                Ir para Login
              </button>
            )}
          </div>
        )}
        
        <div className="space-y-1.5">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome Completo</label>
           <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="text" required placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-5 pl-12 text-sm font-bold shadow-sm h-14 focus:ring-2 focus:ring-black outline-none transition-all" />
           </div>
        </div>

        <div className="space-y-1.5">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">E-mail</label>
           <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="email" required placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-5 pl-12 text-sm font-bold shadow-sm h-14 focus:ring-2 focus:ring-black outline-none transition-all" />
           </div>
        </div>
        
        <div className="space-y-1.5">
           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Senha de Acesso</label>
           <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="Crie uma senha forte" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-white border border-black/5 rounded-2xl p-5 pl-12 pr-12 text-sm font-bold shadow-sm h-14 focus:ring-2 focus:ring-black outline-none transition-all" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
           </div>

           {/* Checklist de Validação */}
           <div className="bg-white/50 border border-black/5 rounded-2xl p-4 mt-3 grid grid-cols-2 gap-y-2 gap-x-4">
              <div className="col-span-2 mb-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sua senha deve conter:</span>
              </div>
              <Criterion met={passwordCriteria.length} label="8 a 70 caracteres" />
              <Criterion met={passwordCriteria.lower} label="Letra minúscula" />
              <Criterion met={passwordCriteria.upper} label="Letra maiúscula" />
              <Criterion met={passwordCriteria.number} label="Pelo menos 1 número" />
              <Criterion met={passwordCriteria.special} label="Símbolo (!@#$%)" />
           </div>
        </div>

        <div className="pt-4">
            <Button 
              fullWidth 
              size="lg" 
              type="submit" 
              isLoading={isLoading} 
              variant="black"
              className={`h-16 shadow-xl transition-all ${isPasswordValid ? 'bg-black' : 'bg-gray-200 cursor-not-allowed grayscale'}`}
              disabled={!isPasswordValid || isLoading}
            >
                Continuar
            </Button>
        </div>

        <div className="text-center pt-2">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-tight">
                Já tem conta? <Link to="/login" className="text-black font-black underline underline-offset-4">Fazer Login</Link>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
