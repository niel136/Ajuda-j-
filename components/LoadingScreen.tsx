
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#F8FAF5] z-[999] flex flex-col items-center justify-center p-8 animate-app-in">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-black/5 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#E2F687] rounded-full border-t-transparent animate-spin"></div>
        <img 
          src="https://i.postimg.cc/DyndbWTX/20260202-061526.png" 
          alt="AjudaJá" 
          className="absolute inset-0 m-auto w-12 h-12 object-contain animate-pulse"
        />
      </div>
      <h2 className="text-lg font-black tracking-tighter text-black uppercase">Sincronizando...</h2>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Preparando sua experiência segura</p>
    </div>
  );
};

export default LoadingScreen;
