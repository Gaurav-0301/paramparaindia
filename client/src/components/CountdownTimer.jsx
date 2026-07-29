import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const destination = new Date(targetDate || Date.now() + 15 * 24 * 60 * 60 * 1000).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 my-3 sm:my-4">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds }
      ].map((unit, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 rounded-lg glass-panel flex items-center justify-center text-sm sm:text-2xl font-serif-display font-semibold text-[#3A342E] shadow-sm border border-[#D4B896]/40">
            {String(unit.value).padStart(2, '0')}
          </div>
          <span className="text-[9px] sm:text-xs uppercase tracking-widest text-[#9CAF97] font-medium mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
