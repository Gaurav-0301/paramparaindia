import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const WebsitePreloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  const taglines = [
    "Curating Festive Splendor...",
    "Handcrafting Timeless Gifting...",
    "Unveiling Royal Heritage Collections..."
  ];

  useEffect(() => {
    // Progress interval (0 to 100 over ~1.6 seconds)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600); // match CSS fade duration
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 45);

    // Tagline rotator
    const taglineInterval = setInterval(() => {
      setTaglineIndex(prev => (prev + 1) % taglines.length);
    }, 550);

    return () => {
      clearInterval(interval);
      clearInterval(taglineInterval);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1F1C18] text-[#FAF7F2] transition-opacity duration-700 ease-in-out px-4 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Decorative Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4B896]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md w-full">
        
        {/* Animated Festive Gold Motif Logo */}
        <div className="relative flex items-center justify-center p-3">
          {/* Outer rotating gold mandala outline */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#D4B896]/50 animate-spin-slow"></div>
          {/* Pulse aura */}
          <div className="absolute inset-2 rounded-full border border-[#D4B896]/30 animate-ping opacity-20"></div>
          {/* Inner Logo Image */}
          <div className="relative z-10 bg-[#FAF7F2] p-3 rounded-2xl shadow-xl shadow-[#D4B896]/20 border border-[#D4B896]/40">
            <img src="/logo.png" alt="Parampara India Logo" className="h-16 w-auto object-contain" />
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4B896]">
            Est. 2026 • India
          </span>
          <p className="text-xs uppercase tracking-widest text-[#D4B896]/80 font-medium">
            Festive Luxury & Artisanal Heritage
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-2 pt-4">
          <div className="flex justify-between items-center text-xs font-mono text-[#D4B896]/80 px-1">
            <span className="text-[11px] font-sans italic text-[#FAF7F2]/70">
              {taglines[taglineIndex]}
            </span>
            <span className="font-bold text-[#D4B896]">{Math.min(progress, 100)}%</span>
          </div>

          <div className="w-full h-1.5 bg-[#3A342E] rounded-full overflow-hidden p-0.5 border border-[#D4B896]/30 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#B8986C] via-[#D4B896] to-[#FAF7F2] rounded-full transition-all duration-150 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Bottom Gold Thread Detail */}
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4B896]/50 to-transparent pt-2"></div>
      </div>
    </div>
  );
};

export default WebsitePreloader;
