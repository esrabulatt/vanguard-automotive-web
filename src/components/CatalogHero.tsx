import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Car, Category } from '../types/car';

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Banner'da kullanılan iki araç: solda arazi, sağda lüks */
const LEFT_ID = 'car-1';
const RIGHT_ID = 'car-2';

const EdgeWords: React.FC<{ side: 'left' | 'right'; words: string[] }> = ({ side, words }) => (
  <motion.div
    initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1.2, ease, delay: 0.3 }}
    className={`absolute top-1/2 -translate-y-1/2 z-10 flex gap-1 select-none pointer-events-none ${
      side === 'left' ? 'left-3 sm:left-8 text-[#162231]' : 'right-3 sm:right-8 text-white flex-row-reverse'
    }`}
  >
    {words.map((word, i) => (
      <span
        key={word}
        className={`leading-[0.85] tracking-tight ${i === 0 ? 'font-bold text-[clamp(2.2rem,5vw,5.5rem)]' : 'font-medium text-[clamp(1.3rem,3vw,3.4rem)] opacity-60'}`}
        style={{ writingMode: 'vertical-rl', transform: side === 'left' ? 'rotate(180deg)' : undefined }}
      >
        {word}
      </span>
    ))}
  </motion.div>
);

// Katalog sayfasının kapağı: ikiye bölünmüş Arazi vs Lüks görseli, ortada editoryal manşet
// Kategoriye göre manşet; "Tümü"de iki araç yan yana, Arazi/Lüks'te tek araç tam genişlikte
const HEADLINES: Record<Category | 'All', { eyebrow: string; line1: string; line2: string }> = {
  All: { eyebrow: 'BUTİK OTOMOBİL KOLEKSİYONU', line1: 'İki Ayrı Karakter,', line2: 'Tek Bir Standart.' },
  'Off-Road': { eyebrow: 'ARAZİ KOLEKSİYONU', line1: 'Yolun Bittiği Yerde', line2: 'Başlayanlar.' },
  Luxury: { eyebrow: 'LÜKS KOLEKSİYON', line1: 'Konforun', line2: 'En Sağlam Hâli.' },
};

export const CatalogHero: React.FC<{ cars: Car[]; category: Category | 'All'; onScrollDown: () => void }> = ({
  cars,
  category,
  onScrollDown,
}) => {
  const leftCar = cars.find((c) => c.id === LEFT_ID);
  const rightCar = cars.find((c) => c.id === RIGHT_ID);
  const showLeft = category !== 'Luxury';
  const showRight = category !== 'Off-Road';
  const single = showLeft !== showRight;
  const left = showLeft ? leftCar : undefined;
  const right = showRight ? rightCar : undefined;
  const headline = HEADLINES[category];

  return (
    <section
      key={category}
      className={`relative mt-[72px] h-[max(520px,min(42.857vw,calc(100svh-72px)))] overflow-hidden ${
        category === 'Off-Road' ? 'bg-[#e8e2d6]' : 'bg-[#16211b]'
      }`}
    >
      {/* İki görsel: ortada yumuşak geçişle birleşir */}
      {[left, right].map(
        (car, i) =>
          car && (
            <motion.img
              key={car.id}
              src={car.image}
              alt={car.name}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease, delay: i * 0.15 }}
              className={`absolute inset-y-0 h-full object-cover ${single ? 'inset-x-0 w-full' : `w-[56%] ${i === 0 ? 'left-0' : 'right-0'}`}`}
              style={{
                objectPosition: single ? (i === 0 ? '45% 55%' : '60% 50%') : i === 0 ? '40% 55%' : '62% 50%',
                ...(i === 1 && !single
                  ? { WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 16%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 16%)' }
                  : {}),
              }}
            />
          ),
      )}

      {/* Kenar renkleri ve ortadaki manşet için karartma */}
      {showLeft && <div className="absolute inset-y-0 left-0 w-[24%] bg-gradient-to-r from-[#e8e2d6]/95 via-[#e8e2d6]/55 to-transparent" />}
      {showRight && <div className="absolute inset-y-0 right-0 w-[24%] bg-gradient-to-l from-[#16211b]/95 via-[#16211b]/55 to-transparent" />}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,12,12,0.62)_0%,rgba(10,12,12,0.3)_45%,rgba(10,12,12,0)_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />

      {showLeft && <EdgeWords side="left" words={['ARAZİ', 'OFF-ROAD']} />}
      {showRight && <EdgeWords side="right" words={['LÜKS', 'PREMIUM']} />}

      {/* Manşet */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-16 sm:px-40 text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className="font-mono text-[10px] sm:text-[11px] tracking-[0.45em] text-[#e2cc9b]"
        >
          {headline.eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.65 }}
          className="mt-5 font-serif font-medium leading-[1.02] text-[clamp(2.2rem,5.4vw,5.6rem)] drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]"
        >
          {headline.line1}
          <br />
          <span className="italic text-[#f1ece2]/90">{headline.line2}</span>
        </motion.h1>
      </div>

      {/* Aşağı kaydırma göstergesi */}
      <motion.button
        type="button"
        onClick={onScrollDown}
        aria-label="Koleksiyona in"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="group absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/75 hover:text-white"
      >
        <span className="font-mono text-[10px] tracking-[0.35em]">KOLEKSİYON</span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/50 p-1.5">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-2 w-[2px] rounded-full bg-white"
          />
        </span>
        <ChevronDown className="w-4 h-4 -mt-1 opacity-60" strokeWidth={1.5} />
      </motion.button>
    </section>
  );
};
