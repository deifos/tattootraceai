import React from 'react';

interface GraffitiWordProps {
  word: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const GraffitiWord: React.FC<GraffitiWordProps> = ({ word, className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} font-black select-none pointer-events-none`}>
      <div 
        className="relative"
        style={{
          fontFamily: 'Impact, Arial Black, sans-serif',
          textShadow: '2px 2px 0px rgba(0,0,0,0.1), 4px 4px 0px rgba(0,0,0,0.05)',
          letterSpacing: '0.1em',
          transform: 'skew(-5deg)',
        }}
      >
        {/* Main text */}
        <span className="relative z-10 text-black opacity-2">
          {word}
        </span>
        
        {/* Drip effect */}
        <div className="absolute top-full left-0 w-full">
          {/* Random drips for each letter */}
          {word.split('').map((letter, index) => (
            <div
              key={index}
              className="absolute bg-black opacity-1"
              style={{
                left: `${(index / word.length) * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 15 + 5}px`,
                transform: `translateX(${Math.random() * 10 - 5}px)`,
                borderRadius: '0 0 50% 50%',
              }}
            />
          ))}
        </div>
        
        {/* Splatter dots */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-black rounded-full opacity-1"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Predefined tattoo words component
export const TattooGraffitiWords: React.FC = () => {
  const tattooWords = [
    { word: 'INK', size: 'large' as const, position: 'top-20 left-10', rotation: 'rotate-12' },
    { word: 'TRIBAL', size: 'medium' as const, position: 'top-40 right-20', rotation: '-rotate-6' },
    { word: 'FLASH', size: 'small' as const, position: 'top-96 left-1/4', rotation: 'rotate-45' },
    { word: 'SLEEVE', size: 'medium' as const, position: 'top-1/2 right-10', rotation: '-rotate-12' },
    { word: 'SCRIPT', size: 'small' as const, position: 'bottom-60 left-20', rotation: 'rotate-30' },
    { word: 'BOLD', size: 'large' as const, position: 'bottom-40 right-1/3', rotation: '-rotate-8' },
    { word: 'ART', size: 'medium' as const, position: 'top-60 left-1/2', rotation: 'rotate-15' },
    { word: 'SKIN', size: 'small' as const, position: 'bottom-80 right-1/4', rotation: '-rotate-20' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {tattooWords.map((item, index) => (
        <GraffitiWord
          key={index}
          word={item.word}
          size={item.size}
          className={`absolute ${item.position} ${item.rotation}`}
        />
      ))}
    </div>
  );
};

// White Grid with Dots Background
export const CircularPatterns: React.FC = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px),
          radial-gradient(circle, rgba(51,65,85,0.08) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px, 20px 20px, 20px 20px",
        backgroundPosition: "0 0, 0 0, 0 0",
      }}
    />
  );
};

// Keep the original ink splashes as a simpler option
export const InkSplash: React.FC<{ className?: string; size?: 'small' | 'medium' | 'large' }> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 5C55 5 60 8 60 15C60 20 58 25 55 30L52 40L50 60L48 40L45 30C42 25 40 20 40 15C40 8 45 5 50 5Z"
        fill="currentColor"
        opacity="0.04"
      />
      <path
        d="M35 20C37 18 40 20 40 25L38 35L36 45L34 35L32 25C32 20 33 18 35 20Z"
        fill="currentColor"
        opacity="0.05"
      />
      <circle cx="25" cy="70" r="2" fill="currentColor" opacity="0.06" />
      <circle cx="75" cy="65" r="1.5" fill="currentColor" opacity="0.05" />
    </svg>
  );
};