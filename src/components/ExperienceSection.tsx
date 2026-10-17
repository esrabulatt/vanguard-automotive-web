import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSmoothScrollProgress } from '../hooks/useScroll';
import { useCarStore } from '../store/useCarStore';

interface Story {
  image: string;
  label: string;
  title: string;
  text: string;
}

const STORIES: Record<'sky' | 'summit' | 'family' | 'detail', Story> = {
  sky: {
    image: '/experience/parasut.jpg',
    label: '01 · ÖZGÜRLÜK',
    title: 'Gökyüzüne en yakın yol.',
    text: 'Aracınız sizi zirveye bırakır; gerisi rüzgârın işi.',
  },
  summit: {
    image: '/experience/zirve.jpg',
    label: '02 · ZİRVE',
    title: 'Asfaltın bittiği yerden sonrası.',
    text: 'Patikanın başına kadar biz götürürüz, son birkaç adım sizin.',
  },
  family: {
    image: '/experience/aile.jpg',
    label: '03 · AİLE',
    title: 'En değerli yük.',
    text: 'İlk kamp, ilk gün doğumu, ilk “bir daha gelelim mi?” sorusu.',
  },
  detail: {
    image: '/experience/kilit.jpg',
    label: '04 · AYRINTI',
    title: 'Her kilit bir söz.',
    text: 'Yıllar sonra bile ilk günkü gibi kapanan kapılar.',
  },
};

// Görsel aşağıdan perde gibi açılarak belirir; yazısı görselin üzerinde durur
const Tile: React.FC<{ story: Story; className?: string; delay?: number }> = ({ story, className = '', delay = 0 }) => (
  <figure className={`reveal-clip group relative overflow-hidden rounded-xl ${className}`}>
    {/* Kırpma içteki katmanda; dış çerçeve görünür kaldığı için kaydırınca doğru tetiklenir */}
    <div className="clip-inner absolute inset-0 bg-gray-900" style={{ transitionDelay: `${delay}ms` }}>
      <img
        src={story.image}
        alt={story.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/70" />
      <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
        <p className="font-mono text-[10px] tracking-[0.3em] text-white/70">{story.label}</p>
        <p className="mt-2 font-serif text-2xl sm:text-3xl leading-tight">{story.title}</p>
        <p className="mt-2 max-w-sm text-sm text-white/80 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-500">
          {story.text}
        </p>
      </figcaption>
    </div>
  </figure>
);

// Arazi/Lüks vitrininden önce gelen ferah "deneyim" bölümü:
// başlık → tam genişlik paralaks görsel → farklı boyutlarda kareler
export const ExperienceSection: React.FC = () => {
  const openFleet = useCarStore((state) => state.openFleet);
  const wideRef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  // Galeri ekrandan çıkarken solup kararır; ardından gelen köprü bölümü bu kararmayı devam ettirir
  const { scrollYProgress: mosaicExit } = useScroll({ target: mosaicRef, offset: ['end end', 'end start'] });
  const mosaicOpacity = useTransform(mosaicExit, [0, 0.8], [1, 0.15]);
  const mosaicFilter = useTransform(mosaicExit, [0, 0.8], ['brightness(1) saturate(1)', 'brightness(0.35) saturate(0.6)']);
  const mosaicScale = useTransform(mosaicExit, [0, 0.8], [1, 0.96]);
  const wideProgress = useSmoothScrollProgress(wideRef);

  return (
    <section className="bg-[#ece8e1] pt-24 sm:pt-36 pb-10">
      {/* Başlık */}
      <div className="px-4 sm:px-12 max-w-[1500px] mx-auto grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-end">
        <h2 className="reveal font-semibold tracking-tight leading-[0.95] text-gray-900 text-[clamp(2.8rem,6vw,6.5rem)]">
          Yolu arkanda bırak.
          <br />
          <span className="font-serif font-medium italic text-gray-500">Keşfedilmemişe doğru.</span>
        </h2>
        <div className="reveal lg:pb-4" style={{ transitionDelay: '150ms' }}>
          <p className="max-w-md text-base sm:text-lg leading-relaxed text-gray-600">
            Sadece bir araç değil; doğayla baş başa kalacağınız, kendi sınırlarınızı aşacağınız bir keşif deneyimi.
          </p>
          <button
            type="button"
            onClick={() => openFleet('All')}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-gray-900 px-6 py-3.5 font-mono text-[11px] tracking-[0.25em] text-white hover:bg-accent transition-colors"
          >
            DENEYİMİ KEŞFET <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Tam genişlik paralaks görsel */}
      <div ref={wideRef} className="mt-16 sm:mt-24 px-3 sm:px-6" style={{ height: '120vh' }}>
        <div className="sticky top-[12vh] h-[76vh] overflow-hidden rounded-2xl">
          <img
            src={STORIES.sky.image}
            alt={STORIES.sky.title}
            loading="lazy"
            className="absolute inset-0 w-full h-[125%] object-cover will-change-transform"
            style={{ transform: `translateY(${-wideProgress * 18}%) scale(${1.12 - wideProgress * 0.1})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          <div
            className="absolute inset-x-0 bottom-0 p-6 sm:p-12 text-white"
            style={{ opacity: Math.min(1, wideProgress * 3), transform: `translateY(${(1 - Math.min(1, wideProgress * 3)) * 30}px)` }}
          >
            <p className="font-mono text-xs tracking-[0.35em] text-white/75">{STORIES.sky.label}</p>
            <p className="mt-3 font-serif text-4xl sm:text-7xl leading-[1.05]">{STORIES.sky.title}</p>
            <p className="mt-4 max-w-lg text-base sm:text-lg text-white/85">{STORIES.sky.text}</p>
          </div>
        </div>
      </div>

      {/* Mozaik: uzun dikey zirve, yanında geniş aile ve kare ayrıntı */}
      <motion.div
        ref={mosaicRef}
        style={{ opacity: mosaicOpacity, filter: mosaicFilter, scale: mosaicScale }}
        className="mt-6 sm:mt-10 px-3 sm:px-6 max-w-[1720px] mx-auto grid gap-3 sm:gap-4 sm:grid-cols-5 sm:grid-rows-2 sm:h-[110vh] origin-bottom"
      >
        <Tile story={STORIES.summit} className="aspect-[4/5] sm:aspect-auto sm:col-span-2 sm:row-span-2" />
        <Tile story={STORIES.family} className="aspect-[16/10] sm:aspect-auto sm:col-span-3" delay={120} />
        <Tile story={STORIES.detail} className="aspect-square sm:aspect-auto sm:col-span-2" delay={240} />
        <div className="reveal flex flex-col justify-end rounded-xl bg-[#1d2a22] p-6 sm:p-8 text-white" style={{ transitionDelay: '360ms' }}>
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/60">SIRADAKİ</p>
          <p className="mt-3 font-serif text-2xl sm:text-3xl leading-tight">Sizi hangi yol bekliyor?</p>
          <button
            type="button"
            onClick={() => openFleet('All')}
            className="mt-3 inline-flex items-center gap-2 py-2 font-mono text-[11px] tracking-[0.25em] text-white/80 hover:text-white"
          >
            ARAZİ MI, LÜKS MÜ? <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};
