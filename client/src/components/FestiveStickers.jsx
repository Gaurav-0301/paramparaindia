import React from 'react';

// 1. Handcrafted Traditional Rakhi SVG Sticker with Hinglish Tag
export const RakhiSticker = ({ className = "w-22 h-22", animated = true }) => {
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${animated ? 'animate-bounce-slow' : ''} ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Outer Festive Radial Glow */}
        <circle cx="100" cy="100" r="85" fill="url(#goldGlow)" fillOpacity="0.25" />
        
        {/* Left Rakhi Silk Thread */}
        <path d="M 10 100 Q 50 115 80 100" stroke="url(#threadGradient)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 10 100 Q 50 85 80 100" stroke="#D4B896" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
        <circle cx="35" cy="103" r="5" fill="#D4AF37" />
        <circle cx="55" cy="98" r="4.5" fill="#E8D3CE" />

        {/* Right Rakhi Silk Thread */}
        <path d="M 120 100 Q 150 85 190 100" stroke="url(#threadGradient)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 120 100 Q 150 115 190 100" stroke="#D4B896" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
        <circle cx="145" cy="97" r="4.5" fill="#E8D3CE" />
        <circle cx="165" cy="102" r="5" fill="#D4AF37" />

        {/* Central Floral Mandala Motif */}
        <circle cx="100" cy="100" r="44" fill="#FAF7F2" stroke="#D4B896" strokeWidth="3.5" />
        
        {/* Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <g key={index} transform={`rotate(${angle} 100 100)`}>
            <path d="M 100 60 C 93 72 93 83 100 87 C 107 83 107 72 100 60 Z" fill={index % 2 === 0 ? "#9CAF97" : "#D4B896"} opacity="0.95" />
            <circle cx="100" cy="64" r="3" fill="#C0392B" />
          </g>
        ))}

        {/* Inner Gem Core */}
        <circle cx="100" cy="100" r="19" fill="url(#rubyGradient)" stroke="#FAF7F2" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="11" fill="#D4AF37" />
        <circle cx="97" cy="97" r="3.5" fill="#FFFFFF" opacity="0.9" />

        {/* Sparkles */}
        <path d="M 68 42 L 71 50 L 79 53 L 71 56 L 68 64 L 65 56 L 57 53 L 65 50 Z" fill="#D4AF37" />
        <path d="M 132 138 L 134 143 L 139 145 L 134 147 L 132 152 L 130 147 L 125 145 L 130 143 Z" fill="#9CAF97" />

        <defs>
          <radialGradient id="goldGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) scale(85)">
            <stop stopColor="#D4B896" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FAF7F2" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="threadGradient" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C0392B" />
            <stop offset="0.5" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#C0392B" />
          </linearGradient>

          <radialGradient id="rubyGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) scale(19)">
            <stop stopColor="#E74C3C" />
            <stop offset="1" stopColor="#800000" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Hinglish Tagline Pill */}
      <span className="px-2 py-0.5 -mt-2.5 z-10 bg-[#3A342E] text-[#FAF7F2] text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase rounded-full border border-[#D4B896] shadow-sm whitespace-nowrap">
        Pyaar Ka Dhaaga 🧵
      </span>
    </div>
  );
};

// 2. Brother & Sister Bond Badge / Sticker in Hinglish
export const BrotherSisterSticker = ({ className = "w-24 h-24" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center p-2.5 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border-2 border-[#D4B896] shadow-lg hover:scale-105 transition-transform duration-300 ${className}`}>
      {/* Rotating Scalloped Outer Ring */}
      <div className="absolute inset-0 rounded-full border border-dashed border-[#9CAF97]/70 animate-spin-slow"></div>

      <div className="flex flex-col items-center justify-center text-center z-10 px-1.5 py-0.5">
        {/* Heart Knot & Icons */}
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-xs">🌸</span>
          <svg className="w-3.5 h-3.5 text-[#C0392B] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-xs">✨</span>
        </div>

        <span className="font-serif-display font-bold text-[10px] sm:text-[11px] text-[#3A342E] uppercase tracking-wider leading-tight">
          Bhai • Behen
        </span>
        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#9CAF97] font-bold mt-0.5">
          Khatta-Meetha Pyar ❤️
        </span>
      </div>
    </div>
  );
};

// 3. Shubh Raksha Bandhan Stamp / Seal Sticker in Hinglish
export const RakshaBandhanStamp = ({ className = "w-20 h-20" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-[#3A342E] via-[#4A423B] to-[#25211D] text-[#FAF7F2] border-2 border-[#D4B896] shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300 ${className}`}>
      <div className="absolute inset-0.5 rounded-lg border border-dashed border-[#D4B896]/60"></div>
      <div className="text-center z-10 p-0.5">
        <span className="text-[10px] block text-[#D4B896]">🪔</span>
        <span className="font-serif-display text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#FAF7F2] block">
          Pyari Behen
        </span>
        <span className="text-[8px] uppercase tracking-widest text-[#D4B896] font-medium block mt-0.5">
          Pyara Bhaiya 💖
        </span>
      </div>
    </div>
  );
};

// 4. Hinglish Floating Decorative Rakhi Banner Component
export const RakhiStickerBanner = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3 px-5 bg-[#FAF7F2]/90 backdrop-blur-md rounded-2xl border border-[#D4B896]/40 shadow-xs max-w-3xl mx-auto my-4 text-center sm:text-left">
      <RakhiSticker className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" />
      <div className="space-y-0.5 max-w-md">
        <div className="flex items-center justify-center sm:justify-start gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-[#9CAF97]/20 text-[#3A342E] text-[9px] font-semibold uppercase tracking-widest border border-[#9CAF97]">
            Bhai-Behen Ka Anokha Bandhan 🌸
          </span>
        </div>
        <h3 className="font-serif-display text-sm sm:text-base font-semibold text-[#3A342E]">
          Pure Silk Rakhis, Lumba Sets & Artisanal Sweets
        </h3>
        <p className="text-[11px] text-[#3A342E]/80 leading-relaxed">
          Shor, Masti aur Beshumar Pyaar — Is Rakhi apno ko bhejo Shuddh Kaju Katli & Designer Rakhis!
        </p>
      </div>
      <BrotherSisterSticker className="w-16 h-16 sm:w-18 sm:h-18 shrink-0 hidden md:inline-flex" />
    </div>
  );
};
