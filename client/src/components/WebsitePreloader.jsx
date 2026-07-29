import React, { useState, useEffect } from 'react';

const WebsitePreloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Fast minimal progress interval (0 to 100 over ~0.9s)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] text-[#3A342E] transition-opacity duration-400 ease-in-out px-4 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4 max-w-xs w-full">
        {/* Minimal Pulsing Lotus Icon */}
        <div className="relative">
          <img
            src="/lotus-icon.png"
            alt="Parampara India"
            className="h-16 w-auto object-contain animate-pulse"
          />
        </div>

        {/* Minimal Brand Name */}
        <span className="font-serif-display text-xl font-semibold tracking-widest text-[#3A342E]">
          PARAMPARA <span className="text-[#D4B896] italic font-normal">INDIA</span>
        </span>

        {/* Thin Minimal Gold Line Progress */}
        <div className="w-36 h-0.5 bg-[#EFE6D8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4B896] transition-all duration-100 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreloader;
