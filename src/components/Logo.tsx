import React from 'react';
import { useStore } from '../store';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { theme } = useStore();

  const sizeClasses = {
    sm: 'h-8 text-lg gap-2',
    md: 'h-10 text-xl gap-2.5',
    lg: 'h-14 text-2xl gap-3',
    xl: 'h-20 text-4xl gap-4',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
    xl: 'w-16 h-16',
  };

  const isLight = theme === 'light';

  return (
    <div id="restaurant-logo" className={`flex items-center font-sans font-bold tracking-wider select-none ${isLight ? 'text-slate-900' : 'text-white'} ${sizeClasses[size]} ${className}`}>
      {/* Visual Logo Icon */}
      <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-tr ${isLight ? 'from-purple-100 via-purple-50 to-purple-200' : 'from-black via-slate-900 to-purple-950'} p-1 shadow-lg ${isLight ? 'shadow-purple-500/10 border-purple-200' : 'shadow-purple-950/20 border-purple-500/30'} border ${iconSizes[size]}`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full ${isLight ? 'bg-purple-600/5' : 'bg-purple-600/10'} blur-sm`}></div>
        
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${isLight ? 'text-purple-700' : 'text-white'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Plate Circle */}
          <circle cx="50" cy="50" r="38" className="text-purple-500" strokeWidth="4" strokeDasharray="6 3" />
          <circle cx="50" cy="50" r="32" className={isLight ? 'text-purple-600/20' : 'text-white/35'} strokeWidth="2" />
          
          {/* Elegant Fork - Left side of the cross */}
          <path
            d="M38 72 L46 54 M38 52 L38 32 M34 32 L34 44 C34 48, 42 48, 42 44 L42 32 M38 32 L38 42"
            stroke="currentColor"
            strokeWidth="4"
          />
          
          {/* Elegant Spoon - Right side of the cross */}
          <path
            d="M62 72 L54 54 M62 32 C56 32, 56 50, 62 50 C68 50, 68 32, 62 32 Z"
            fill="currentColor"
            className="text-purple-400"
            stroke="currentColor"
            strokeWidth="3"
          />

          {/* Central Fork / Spoon Intersection Accent dot */}
          <circle cx="50" cy="54" r="3" fill="#a855f7" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${isLight ? 'from-purple-900 via-purple-700 to-purple-600' : 'from-white via-purple-100 to-purple-400'}`}>
          Midnight
        </span>
        <span className={`text-[10px] font-semibold tracking-[0.25em] uppercase ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
          Fork
        </span>
      </div>
    </div>
  );
};
export default Logo;
