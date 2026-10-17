import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCarStore } from '../store/useCarStore';

// Hikâye galerisi ile Arazi/Lüks sahnesi arasındaki köprü:
// kaydırdıkça açık zemin yumuşakça kararır, ortada filo çağrısı belirir.
export const FleetBridge: React.FC<{ carCount: number }> = ({ carCount }) => {
  const ref = useRef<HTMLElement>(null);
  const { openFleet, openReserve } = useCarStore();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // 0 → bölüm alttan girer, 1 → üstten çıkar
  const background = useTransform(scrollYProgress, [0.1, 0.45], ['#ece8e1', '#16181b']);
  const glow = useTransform(scrollYProgress, [0.35, 0.55, 0.85], [0, 0.55, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.38, 0.52, 0.8, 0.95], [0, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0.38, 0.55], [40, 0]);
  const lineScale = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);

  return (
    <motion.section ref={ref} style={{ background }} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Ortadan yayılan çok hafif sıcak ışık */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: glow }}
          className="absolute w-[80vmax] h-[80vmax] rounded-full bg-[radial-gradient(circle,rgba(232,83,47,0.18)_0%,rgba(232,83,47,0)_60%)] pointer-events-none"
        />

        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="relative text-center">
          <p className="font-mono text-[11px] tracking-[0.4em] text-white/50">VANGUARD AUTOMOTIVE</p>
          <h2 className="mt-6 font-serif font-medium text-white leading-[1.05] text-[clamp(2.6rem,6vw,6rem)]">
            Yolculuğa Başlamaya
            <br />
            <span className="italic text-white/70">Hazır mısınız?</span>
          </h2>
          <motion.div style={{ scaleX: lineScale }} className="mx-auto mt-10 h-px w-40 origin-center bg-white/30" />
          <motion.button
            type="button"
            onClick={() => openFleet('All')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="group mt-10 inline-flex items-center gap-4 rounded-full border border-white/40 bg-white/5 whitespace-nowrap px-6 sm:px-12 py-5 sm:py-6 font-mono text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.3em] text-white backdrop-blur-sm hover:bg-white hover:text-gray-900 transition-colors"
          >
            TÜM FİLOYU İNCELE ({carCount} MODEL)
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
          <div>
            <button
              type="button"
              onClick={() => openReserve(null, 'showroom')}
              className="group mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-white/55 hover:text-[#e2cc9b] transition-colors"
            >
              <span className="text-white/35 tracking-normal font-serif italic text-sm">veya</span> SHOWROOM RANDEVUSU AL
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
