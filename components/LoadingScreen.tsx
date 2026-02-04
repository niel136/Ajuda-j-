
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#F8FAF5] z-[999] flex flex-col items-center justify-center p-8 transition-opacity duration-300">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-black/5 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#E2F687] rounded-full border-t-transparent animate-spin"></div>
        <img 
          src="https://i.postimg.cc/DyndbWTX/20260202-061526.png" 
          alt="AjudaJá Logo" 
          className="absolute inset-0 m-auto w-12 h-12 object-contain animate-pulse"
        />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-black tracking-tighter text-black uppercase">Sincronizando</h2>
        <div className="flex gap-1 justify-center mt-1">
          <div className="w-1.5 h-1.5 bg-[#E2F687] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-[#E2F687] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-[#E2F687] rounded-full animate-bounce"></div>
        </div>
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-4">Conexão segura garantida</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
