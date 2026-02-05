
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase, uploadFile } from '../lib/supabase';
import Button from '../components/Button';
import MascotAvatar from '../components/MascotAvatar';
import { ArrowLeft, User, Save, CheckCircle2, Camera, X } from 'lucide-react';

const EditProfile: React.FC = () => {
  const { user, profile, updateProfile } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [seed, setSeed] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [usePhoto, setUsePhoto] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.nome || '');
      setSeed(profile.avatar_seed || '');
      setAvatarUrl(profile.avatar_url || '');
      setUsePhoto(!!profile.avatar_url);
    }
  }, [profile]);

  const handleRandomize = () => {
    setSeed(Math.random().toString(36).substring(7));
    setUsePhoto(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileName = `avatars/${user.id}/${Date.now()}-${file.name}`;
      const publicUrl = await uploadFile('avatars', fileName, file);
      
      setAvatarUrl(publicUrl);
      setUsePhoto(true);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha ao subir imagem. Verifique se o bucket 'avatars' é público.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        nome: name,
        avatar_seed: seed,
        avatar_url: usePhoto ? avatarUrl : null
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/perfil');
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Houve um problema ao salvar suas alterações. Tente novamente.");
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
        <div className="relative">
          {usePhoto && avatarUrl ? (
            <div className="w-[140px] h-[140px] rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-gray-100 relative">
               <img src={avatarUrl} alt="Foto real" className={`w-full h-full object-cover ${uploading ? 'opacity-40' : ''}`} />
               {uploading && (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                 </div>
               )}
            </div>
          ) : (
            <MascotAvatar seed={seed} size={140} className="border-4 border-white shadow-2xl rounded-[3rem]" />
          )}
          
          <button 
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-12 h-12 bg-black text-[#E2F687] rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#F8FAF5] active:scale-90 transition-transform btn-active disabled:opacity-50"
          >
            <Camera size={20} />
          </button>
          
          {usePhoto && (
            <button 
              onClick={() => { setUsePhoto(false); setAvatarUrl(''); }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#F8FAF5] active:scale-90 transition-transform"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />

        <div className="flex gap-4 mt-6">
           <button 
             type="button"
             onClick={handleRandomize}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!usePhoto ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}
           >
             Novo Mascote
           </button>
           <button 
             type="button"
             onClick={() => setUsePhoto(true)}
             disabled={!avatarUrl}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 ${usePhoto ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}
           >
             Usar Foto
           </button>
        </div>
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
              placeholder="Ex: Maria Santos"
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
            disabled={showSuccess || uploading}
            className="h-16 shadow-2xl"
          >
            {showSuccess ? (
              <span className="flex items-center text-green-600">
                <CheckCircle2 size={20} className="mr-2" /> Salvo!
              </span>
            ) : (
              <span className="flex items-center">
                <Save size={20} className="mr-2" /> Salvar Perfil
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
