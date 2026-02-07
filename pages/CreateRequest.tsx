
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { uploadFile } from '../lib/supabase';
import Button from '../components/Button';
import { Sparkles, ArrowLeft, Save, AlertCircle, Camera, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { enhanceDescription, analyzeRequestConfidence } from '../services/geminiService';

const CreateRequest: React.FC = () => {
  const { saveRequest, user } = useApp();
  const navigate = useNavigate();
  
  // States do formulário
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [description, setDescription] = useState('');
  
  // States de fluxo
  const [step, setStep] = useState<'info' | 'verify' | 'success'>('info');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States de Câmera
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setError("Permissão de câmera negada. Precisamos da foto para segurança.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleEnhance = async () => {
    if (description.length < 10) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceDescription(description, category);
      setDescription(enhanced);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!capturedImage || !user) return;
    setIsSaving(true);
    setError(null);
    try {
      // 1. Upload da Verificação Facial
      const blob = await (await fetch(capturedImage)).blob();
      const fileName = `verificacao/${user.id}/${Date.now()}.jpg`;
      const faceUrl = await uploadFile('verificacao', fileName, blob);

      if (!faceUrl) throw new Error("Falha ao salvar verificação facial.");

      // 2. Análise de confiança via IA
      const confidence = await analyzeRequestConfidence(title, description);

      // 3. Salvar Pedido Real
      await saveRequest({
        titulo: title,
        categoria: category,
        valor_meta: Number(amount),
        pix_key: pixKey,
        descricao: description,
        face_verification_url: faceUrl,
        score_confianca_ia: confidence,
        data_limite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      setStep('success');
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao enviar pedido.");
    } finally {
      setIsSaving(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8 animate-app-in">
        <div className="w-24 h-24 bg-[#E2F687] rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-[#E2F687]/20">
            <CheckCircle2 size={48} className="text-black" />
        </div>
        <h2 className="text-3xl font-black text-black tracking-tighter mb-4 leading-tight">
          Pedido Enviado com Sucesso! ✅
        </h2>
        <p className="text-gray-500 font-bold text-sm leading-relaxed mb-10 max-w-xs">
          Nossa equipe de moderadores irá analisar seu pedido em breve para garantir a segurança de todos.
        </p>
        <Button fullWidth variant="black" size="lg" onClick={() => navigate('/')}>
          Voltar para Home
        </Button>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="pt-2 animate-app-in">
        <header className="flex items-center mb-8">
            <button onClick={() => setStep('info')} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active"><ArrowLeft size={24} /></button>
            <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Segurança</h2>
        </header>

        <div className="flex flex-col items-center text-center">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-3xl mb-6">
                <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-black text-black tracking-tight mb-2">Verificação Facial Anti-Fraude</h3>
            <p className="text-gray-500 font-bold text-xs mb-8 max-w-xs">
                Para sua segurança e dos doadores, confirme que você é uma pessoa real através de uma selfie rápida.
            </p>

            <div className="w-full aspect-square max-w-[320px] bg-black rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl relative mb-10">
                {!capturedImage ? (
                    <>
                        {isCameraActive ? (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-10">
                                <Camera size={48} className="text-gray-800 mb-4" />
                                <Button size="sm" variant="outline" className="border-gray-800 text-gray-800" onClick={startCamera}>Ativar Câmera</Button>
                            </div>
                        )}
                        {isCameraActive && (
                            <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-black/10 active:scale-90 transition-transform shadow-xl" />
                        )}
                    </>
                ) : (
                    <div className="relative w-full h-full">
                        <img src={capturedImage} alt="Capture" className="w-full h-full object-cover scale-x-[-1]" />
                        <button onClick={() => { setCapturedImage(null); startCamera(); }} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md">
                            <X size={20} />
                        </button>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}

            <Button 
                fullWidth 
                variant="black" 
                size="lg" 
                className="h-16"
                disabled={!capturedImage || isSaving}
                isLoading={isSaving}
                onClick={handleFinalSubmit}
            >
                Finalizar e Enviar
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 animate-app-in">
      <header className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active"><ArrowLeft size={24} /></button>
          <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Criar Pedido</h2>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); setStep('verify'); }} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100 mb-6">
          <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <p className="text-[11px] text-blue-700 font-bold leading-tight uppercase tracking-tight">
            Transparência total: Todos os pedidos passam por análise de veracidade via IA e moderação humana.
          </p>
        </div>

        <div className="space-y-4">
            <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-black/5 p-5 font-bold shadow-sm focus:ring-2 focus:ring-black outline-none h-16"
                placeholder="Título do Pedido"
            />

            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="number" required
                    placeholder="Meta R$"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 p-5 font-bold shadow-sm h-16 outline-none"
                />
                <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 p-5 font-bold shadow-sm h-16 outline-none appearance-none"
                >
                    <option>Alimentação</option>
                    <option>Saúde</option>
                    <option>Reforma</option>
                    <option>Educação</option>
                </select>
            </div>

            <input 
                required
                placeholder="Sua Chave Pix"
                value={pixKey}
                onChange={e => setPixKey(e.target.value)}
                className="w-full rounded-2xl border border-black/5 p-5 font-bold shadow-sm h-16 outline-none"
            />

            <div className="relative">
                <textarea 
                    required rows={6}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-2xl border border-black/5 p-5 font-medium shadow-sm outline-none text-base"
                    placeholder="Conte sua história com detalhes para aumentar a confiança..."
                />
                <button 
                  type="button" onClick={handleEnhance}
                  disabled={isEnhancing || description.length < 5}
                  className="absolute bottom-4 right-4 bg-black text-[#E2F687] px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-95 disabled:opacity-30 transition-all shadow-lg"
                >
                  <Sparkles size={12} className={isEnhancing ? 'animate-spin' : ''} /> IA: Melhorar Texto
                </button>
            </div>
        </div>

        <Button fullWidth type="submit" size="lg" variant="black" className="h-16">
            Avançar para Verificação
        </Button>
      </form>
    </div>
  );
};

export default CreateRequest;
