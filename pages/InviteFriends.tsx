
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import MascotAvatar from '../components/MascotAvatar';
import { ArrowLeft, Users, Zap, ShieldCheck, Trophy, CheckCircle2 } from 'lucide-react';

const InviteFriends: React.FC = () => {
  const navigate = useNavigate();
  const { trackFeatureClick, profile } = useApp();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = async () => {
    await trackFeatureClick('invite_friends_waitlist');
    setIsSubscribed(true);
  };

  const benefits = [
    {
      icon: <Zap className="text-yellow-500" />,
      title: "Alcance Ampliado",
      text: "Cada amigo convidado aumenta as chances de um pedido ser atendido em 40%."
    },
    {
      icon: <ShieldCheck className="text-green-500" />,
      title: "Impacto Verificado",
      text: "Visualize a árvore de impacto gerada por suas conexões diretas e indiretas."
    },
    {
      icon: <Trophy className="text-[#E2F687]" />,
      title: "Distintivo Embaixador",
      text: "Ganhe selos exclusivos no perfil ao atingir metas de convites aceitos."
    }
  ];

  return (
    <div className="pt-2 animate-app-in flex flex-col min-h-full">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/perfil')} className="p-2 -ml-2 rounded-full active:bg-black/5 btn-active">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-extrabold text-black ml-2 tracking-tight">Convidar Amigos</h2>
      </div>

      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative">
          <MascotAvatar seed="invite-friends-mascot" size={140} className="border-4 border-white shadow-2xl rounded-[3rem]" />
          <div className="absolute -top-3 -right-3 bg-black text-[#E2F687] text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl border-2 border-[#F8FAF5]">
            Em Breve
          </div>
        </div>
        <h1 className="text-3xl font-black text-black mt-8 tracking-tighter leading-none">
          Convide e <br/><span className="text-gray-400">Transforme</span>
        </h1>
        <p className="text-gray-500 font-bold text-sm mt-4 px-8 leading-relaxed">
          Estamos preparando uma experiência única para você expandir sua rede de solidariedade.
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {benefits.map((b, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] border border-black/5 flex gap-4 items-center shadow-sm">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
              {b.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm">{b.title}</h3>
              <p className="text-xs text-gray-500 font-medium leading-tight mt-0.5">{b.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pb-10">
        <Button 
          fullWidth 
          size="lg" 
          variant={isSubscribed ? "secondary" : "black"} 
          className="h-16"
          onClick={handleNotifyMe}
          disabled={isSubscribed}
        >
          {isSubscribed ? (
            <span className="flex items-center text-green-600">
              <CheckCircle2 className="mr-2" size={20} /> Entramos em contato!
            </span>
          ) : (
            <span className="flex items-center">
              <Users className="mr-2" size={20} /> Quero ser avisado
            </span>
          )}
        </Button>
        <p className="text-[10px] text-center font-black text-gray-400 uppercase tracking-widest mt-4">
          Ajude-nos a priorizar esta função clicando acima.
        </p>
      </div>
    </div>
  );
};

export default InviteFriends;
