import React from 'react';

export const BackgroundGradient: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020202]">
      {/* Organic Blobs */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, #00FF88 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-10"
        style={{ background: 'radial-gradient(circle, #00FFFF 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-10"
        style={{ background: 'radial-gradient(circle, #39FF14 0%, transparent 70%)' }}
      />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(#DADADA 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />
    </div>
  );
};
