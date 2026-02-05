
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import MascotAvatar from '../components/MascotAvatar';
import { ArrowLeft, User, RefreshCw, Save, CheckCircle2 } from 'lucide-react';

const EditProfile: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState(profile?.nome || '');
  const [seed, setSeed] = useState(profile?.avatar_seed || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.nome);
      setSeed(profile.avatar_seed);
    }
  }, [profile]);

  const handleRandomize = () => {
    setSeed(Math.random().toString(36).substring(7));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        nome: name,
        avatar_seed: seed
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/perfil');
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-2 animate-app-in">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/perfil')} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Editar Perfil</h2>
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
          <MascotAvatar 
            seed={seed} 
            size={140} 
            className="border-4 border-white shadow-2xl rounded-[3rem]" 
          />
          <button 
            type="button"
            onClick={handleRandomize}
            className="absolute -bottom-2 -right-2 w-12 h-12 bg-black text-[#E2F687] rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#F8FAF5] active:scale-90 transition-transform btn-active"
          >
            <RefreshCw size={20} />
          </button>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-4">Personalize seu Mascote</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome de Exibição</label>
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-white border border-black/5 rounded-3xl p-5 pl-14 text-base font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-16"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            fullWidth 
            size="lg" 
            variant={showSuccess ? 'secondary' : 'black'} 
            type="submit" 
            isLoading={isSaving}
            disabled={showSuccess}
            className="h-16"
          >
            {showSuccess ? (
              <span className="flex items-center text-green-600">
                <CheckCircle2 size={20} className="mr-2" /> Salvo com Sucesso!
              </span>
            ) : (
              <span className="flex items-center">
                <Save size={20} className="mr-2" /> Salvar Alterações
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
