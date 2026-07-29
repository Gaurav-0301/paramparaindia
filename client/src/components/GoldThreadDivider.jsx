import React from 'react';

const GoldThreadDivider = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center my-8 ${className}`}>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4B896] to-transparent opacity-60"></div>
      <div className="absolute bg-[#FAF7F2] px-4 flex items-center gap-1.5 text-[#D4B896]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4B896]"></span>
        <span className="w-2 h-2 rotate-45 border border-[#D4B896]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4B896]"></span>
      </div>
    </div>
  );
};

export default GoldThreadDivider;
