
import React, { useMemo } from 'react';

interface MascotAvatarProps {
  seed?: string;
  size?: number | string;
  className?: string;
}

const MascotAvatar: React.FC<MascotAvatarProps> = ({ seed = 'default', size = 48, className = '' }) => {
  const mascotData = useMemo(() => {
    // Função simples de hash para gerar números a partir da string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const getVal = (mod: number) => Math.abs(hash % mod);

    // Cores vibrantes no estilo do app
    const colors = [
      '#E2F687', // Lime (Brand)
      '#60A5FA', // Blue
      '#F87171', // Red/Rose
      '#FB7185', // Pink
      '#FBBF24', // Yellow/Orange
      '#A78BFA', // Purple
      '#34D399', // Green
    ];

    // Variações de expressões
    const eyes = [
      // Normal
      <g key="e1"><circle cx="35" cy="40" r="4" fill="black" /><circle cx="65" cy="40" r="4" fill="black" /></g>,
      // Winking
      <g key="e2"><path d="M30 40 Q35 35 40 40" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx="65" cy="40" r="4" fill="black" /></g>,
      // Happy
      <g key="e3"><path d="M30 42 Q35 37 40 42" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/><path d="M60 42 Q65 37 70 42" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/></g>,
      // Cool (Sunglasses)
      <g key="e4"><rect x="25" y="35" width="20" height="12" rx="4" fill="black"/><rect x="55" y="35" width="20" height="12" rx="4" fill="black"/><rect x="45" y="40" width="10" height="3" fill="black"/></g>,
    ];

    const mouths = [
      // Smile
      <path key="m1" d="M40 65 Q50 75 60 65" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />,
      // Big Smile
      <path key="m2" d="M35 60 Q50 80 65 60" fill="black" />,
      // Flat
      <line key="m3" x1="40" y1="65" x2="60" y2="65" stroke="black" strokeWidth="3" strokeLinecap="round" />,
      // Ooh
      <circle key="m4" cx="50" cy="65" r="5" fill="black" />,
    ];

    return {
      bodyColor: colors[getVal(colors.length)],
      eye: eyes[getVal(eyes.length)],
      mouth: mouths[getVal(mouths.length)],
      rotation: (getVal(20) - 10) + 'deg', // Pequena inclinação aleatória
    };
  }, [seed]);

  return (
    <div 
      className={`relative inline-flex items-center justify-center overflow-hidden bg-white/50 border border-black/5 rounded-[1.5rem] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-[85%] h-[85%]"
        style={{ transform: `rotate(${mascotData.rotation})` }}
      >
        {/* Corpo principal (Forma arredondada estilo o mascote AjudaJá) */}
        <path 
          d="M20 30 C20 10 80 10 80 30 L85 70 C85 90 15 90 15 70 Z" 
          fill={mascotData.bodyColor} 
          stroke="black" 
          strokeWidth="3" 
        />
        
        {/* Expressão */}
        {mascotData.eye}
        {mascotData.mouth}

        {/* Detalhe de brilho */}
        <ellipse cx="30" cy="25" rx="8" ry="4" fill="white" fillOpacity="0.4" transform="rotate(-30 30 25)" />
      </svg>
    </div>
  );
};

export default MascotAvatar;
