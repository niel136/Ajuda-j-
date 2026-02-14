
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { ArrowLeft, Building, Hash, Phone, Users, Landmark, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { fetchCNPJData, validateCNPJFormat } from '../services/brasilApiService';

const OnboardingPJ: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading: isRegistering } = useApp();
  
  const [step, setStep] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    segmento: '',
    employees: '',
    faturamento: '',
    responsavel: '',
    email: '',
    password: '',
    telefone: '',
    // Dados da API
    razao_social: '',
    nome_fantasia: '',
    situacao: '',
    cnae_desc: '',
    logradouro: '',
    municipio: '',
    uf: ''
  });

  // Busca automática com Debounce
  useEffect(() => {
    const cleanCnpj = formData.cnpj.replace(/\D/g, "");
    
    // Se o usuário apagou dígitos, reseta o estado de erro e verificação
    if (cleanCnpj.length < 14) {
      setApiError(null);
      setIsVerified(false);
      if (formData.razao_social) {
        setFormData(prev => ({ ...prev, razao_social: '', name: '' }));
      }
      return;
    }

    // Se atingiu 14 dígitos, inicia o timer do debounce
    if (cleanCnpj.length === 14) {
      const timer = setTimeout(() => {
        if (validateCNPJFormat(cleanCnpj)) {
          handleCnpjLookup(cleanCnpj);
        } else {
          setApiError("Formato de CNPJ inválido.");
          setIsVerified(false);
        }
      }, 600); // 600ms de debounce para garantir que o usuário terminou de digitar/colar

      return () => clearTimeout(timer);
    }
    
    // Caso o usuário digite mais que 14 (erro de digitação)
    if (cleanCnpj.length > 14) {
       setApiError("CNPJ deve ter apenas 14 dígitos.");
       setIsVerified(false);
    }
  }, [formData.cnpj]);

  const handleCnpjLookup = async (cnpj: string) => {
    setIsSearching(true);
    setApiError(null);
    console.log(`[OnboardingPJ] Disparando busca para: ${cnpj}`);
    
    try {
      const data = await fetchCNPJData(cnpj);
      setFormData(prev => ({
        ...prev,
        name: data.nome_fantasia || data.razao_social,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        situacao: data.descricao_situacao_cadastral,
        cnae_desc: data.cnae_fiscal_descricao,
        logradouro: data.logradouro,
        municipio: data.municipio,
        uf: data.uf,
        segmento: data.cnae_fiscal_descricao
      }));
      setIsVerified(true);
      console.log(`[OnboardingPJ] Empresa verificada: ${data.razao_social}`);
    } catch (err: any) {
      console.error(`[OnboardingPJ] Erro na busca:`, err.message);
      setApiError(err.message || "Erro ao consultar CNPJ.");
      setIsVerified(false);
      setFormData(prev => ({ ...prev, razao_social: '' }));
    } finally {
      setIsSearching(false);
    }
  };

  const handleNext = () => {
    if (!isVerified) return;
    setStep(2);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, formData.name, 'PJ', {
        ...formData,
        empresa_verificada: true,
        fonte_validacao: 'BrasilAPI'
      });
      navigate('/welcome');
    } catch (e: any) {
      alert(e.message || "Erro ao cadastrar empresa.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col pt-safe">
      <header className="mb-10 flex items-center gap-4">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/tipo-conta')} 
          className="p-2 bg-white rounded-xl shadow-sm active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Parceria PJ</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passo {step} de 2</p>
        </div>
      </header>

      <form onSubmit={handleFinish} className="flex-1 flex flex-col gap-6">
        {step === 1 ? (
          <div className="space-y-5 animate-app-in">
            {/* INPUT CNPJ */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ da Empresa</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required 
                  type="text"
                  placeholder="00.000.000/0000-00" 
                  value={formData.cnpj} 
                  onChange={e => setFormData({...formData, cnpj: e.target.value})} 
                  className={`w-full h-16 bg-white rounded-2xl border ${apiError ? 'border-red-500' : (isVerified ? 'border-emerald-500' : 'border-slate-200')} pl-12 pr-12 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all`} 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   {isSearching ? <Loader2 className="text-indigo-500 animate-spin" size={20} /> : 
                    isVerified ? <CheckCircle2 className="text-emerald-500" size={20} /> : 
                    <Search className="text-slate-200" size={20} />}
                </div>
              </div>
              {apiError && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500 text-[10px] font-bold uppercase tracking-tight px-1">
                  <AlertCircle size={12} /> {apiError}
                </div>
              )}
            </div>

            {/* INPUT RAZÃO SOCIAL (AUTO-FILL) */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razão Social</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  readOnly
                  placeholder={isSearching ? "Buscando dados na Receita..." : "Aguardando CNPJ válido..."}
                  value={formData.razao_social} 
                  className={`w-full h-16 rounded-2xl border border-slate-200 pl-12 pr-4 font-bold outline-none transition-all ${isSearching ? 'bg-indigo-50/30 text-indigo-400' : 'bg-slate-100/50 text-slate-500'}`} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Funcionários</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input placeholder="Ex: 50" type="number" value={formData.employees} onChange={e => setFormData({...formData, employees: e.target.value})} className="w-full h-16 bg-white rounded-2xl border border-slate-200 pl-12 pr-4 font-bold text-slate-900 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faturamento</label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input placeholder="Mensal R$" value={formData.faturamento} onChange={e => setFormData({...formData, faturamento: e.target.value})} className="w-full h-16 bg-white rounded-2xl border border-slate-200 pl-12 pr-4 font-bold text-slate-900 outline-none" />
                </div>
              </div>
            </div>

            {isVerified && (
              <div className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100 animate-app-in">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Empresa Ativa e Localizada</p>
                </div>
                <p className="text-[11px] font-bold text-emerald-800 leading-tight">
                  {formData.logradouro}<br/>
                  {formData.municipio} - {formData.uf}<br/>
                  <span className="opacity-60 block mt-1">{formData.cnae_desc}</span>
                </p>
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                fullWidth 
                variant="black" 
                size="lg" 
                className={`h-16 shadow-lg transition-all ${isVerified ? 'bg-indigo-600' : 'bg-slate-300 grayscale opacity-50'}`} 
                type="button" 
                onClick={handleNext}
                disabled={!isVerified || isSearching}
              >
                {isSearching ? "Consultando..." : "Prosseguir"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-app-in">
             <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
              <input required type="email" placeholder="financeiro@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-16 bg-white rounded-2xl border border-slate-200 px-6 font-bold text-slate-900 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <input required type="password" placeholder="Mínimo 6 caracteres" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-16 bg-white rounded-2xl border border-slate-200 px-6 font-bold text-slate-900 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp de Contato</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required placeholder="(00) 00000-0000" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full h-16 bg-white rounded-2xl border border-slate-200 pl-12 pr-4 font-bold text-slate-900 outline-none" />
              </div>
            </div>
            <div className="pt-6">
              <Button 
                fullWidth 
                variant="black" 
                size="lg" 
                className="bg-indigo-600 h-16 shadow-xl" 
                isLoading={isRegistering} 
                type="submit"
              >
                Criar Conta PJ
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingPJ;
