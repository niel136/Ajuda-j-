
import React, { useMemo } from 'react';

interface MascotAvatarProps {
  seed?: string;
  size?: number | string;
  className?: string;
}

const MascotAvatar: React.FC<MascotAvatarProps> = ({ seed = 'default', size = 48, className = '' }) => {
  const mascotData = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const getVal = (mod: number) => Math.abs(hash % mod);

    const colors = [
      '#C6F64E', // Neon Lime (Brand)
      '#111111', // Deep Black
      '#FFFFFF', // White
      '#60A5FA', // Blue
      '#F87171', // Red
      '#FB7185', // Pink
      '#A78BFA', // Purple
    ];

    const eyes = [
      <g key="e1"><circle cx="35" cy="40" r="4" fill="black" /><circle cx="65" cy="40" r="4" fill="black" /></g>,
      <g key="e2"><path d="M30 40 Q35 35 40 40" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx="65" cy="40" r="4" fill="black" /></g>,
      <g key="e3"><path d="M30 42 Q35 37 40 42" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/><path d="M60 42 Q65 37 70 42" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/></g>,
      <g key="e4"><rect x="25" y="35" width="20" height="12" rx="4" fill="black"/><rect x="55" y="35" width="20" height="12" rx="4" fill="black"/></g>,
    ];

    const mouths = [
      <path key="m1" d="M40 65 Q50 75 60 65" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />,
      <path key="m2" d="M35 60 Q50 80 65 60" fill="black" />,
      <line key="m3" x1="40" y1="65" x2="60" y2="65" stroke="black" strokeWidth="3" strokeLinecap="round" />,
      <circle key="m4" cx="50" cy="65" r="5" fill="black" />,
    ];

    const bodyColor = colors[getVal(colors.length)];
    // If body is black, eyes must be white
    const eyeFill = bodyColor === '#111111' ? 'white' : 'black';

    return {
      bodyColor,
      // Cast to React.ReactElement<any> to fix 'fill' and 'stroke' property errors on 'Partial<unknown>'
      eye: React.cloneElement(eyes[getVal(eyes.length)] as React.ReactElement<any>, { fill: eyeFill }),
      mouth: React.cloneElement(mouths[getVal(mouths.length)] as React.ReactElement<any>, { stroke: eyeFill }),
      rotation: (getVal(14) - 7) + 'deg',
    };
  }, [seed]);

  return (
    <div 
      className={`relative inline-flex items-center justify-center overflow-hidden bg-white/50 border border-black/5 rounded-2xl ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-[85%] h-[85%]"
        style={{ transform: `rotate(${mascotData.rotation})` }}
      >
        <path 
          d="M20 30 C20 10 80 10 80 30 L85 70 C85 90 15 90 15 70 Z" 
          fill={mascotData.bodyColor} 
          stroke={mascotData.bodyColor === '#111111' ? 'white' : 'black'} 
          strokeWidth="3" 
        />
        {mascotData.eye}
        {mascotData.mouth}
      </svg>
    </div>
  );
};

export default MascotAvatar;
