import React from 'react';

// Vanguard Automotive yazı logosu: ince serif marka adı, altında aralıklı küçük alt başlık
export const Logo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const name = { sm: 'text-[19px]', md: 'text-[22px] sm:text-[24px]', lg: 'text-[30px] sm:text-[36px]' }[size];
  const sub = { sm: 'text-[8px]', md: 'text-[8.5px] sm:text-[9.5px]', lg: 'text-[10px] sm:text-[11px]' }[size];
  return (
    <span className={`inline-flex flex-col items-start leading-none select-none ${className}`}>
      <span className={`font-serif font-medium tracking-[0.28em] ${name}`}>VANGUARD</span>
      <span className={`mt-1.5 font-mono font-medium tracking-[0.5em] opacity-85 ${sub}`}>AUTOMOTIVE</span>
    </span>
  );
};
