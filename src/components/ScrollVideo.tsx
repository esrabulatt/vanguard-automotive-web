import React, { useEffect, useRef, useState } from 'react';
import { useSmoothScrollProgress } from '../hooks/useScroll';
import { SCROLL_VIDEO as video, SCROLL_VIDEO_CAPTIONS as captions } from '../constants/scrollVideo';
import { useCarStore } from '../store/useCarStore';
import { carTitle, formatPrice } from '../utils/format';
import { clamp } from '../utils/math';
import type { Car } from '../types/car';

// Tam ekran video; bölüm ekrana sabitlenir ve kaydırdıkça video ileri/geri sarılır.
export const ScrollVideo: React.FC<{ cars: Car[] }> = ({ cars }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progress = useSmoothScrollProgress(sectionRef);
  const [duration, setDuration] = useState(0);
  const openReserve = useCarStore((state) => state.openReserve);
  const car = cars.find((c) => c.id === video.carId);

  const time = progress * duration;

  // Kaydırma ilerlemesini videonun zamanına bağla
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !duration) return;
    const target = Math.min(time, duration - 0.05);
    if (Math.abs(el.currentTime - target) > 1 / 60) el.currentTime = target;
  }, [time, duration]);

  // iOS Safari videoyu oynatılmadan kare göstermez; sessizce bir kez başlatıp durdurulur
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const el = e.currentTarget;
    setDuration(el.duration);
    el.play()
      .then(() => el.pause())
      .catch(() => {});
  };

  return (
    <section ref={sectionRef} style={{ height: `${video.scrollLength}vh` }} className="relative bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedMetadata={handleLoadedMetadata}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        {/* Videonun anına göre değişen başlıklar */}
        {captions.map(({ label, title, start, end }, i) => {
          const local = duration ? (time - start) / (end - start) : i === 0 ? 0.5 : -1;
          const fadeIn = i === 0 ? 1 : clamp(local * 6);
          const fadeOut = i === captions.length - 1 ? 1 : clamp((1 - local) * 6);
          const opacity = local < 0 || local > 1 ? 0 : Math.min(fadeIn, fadeOut);
          return (
            <div
              key={label}
              aria-hidden={opacity < 0.5}
              className="absolute inset-x-4 top-[15%] sm:top-[16%] text-center text-white pointer-events-none"
              style={{ opacity, transform: `translateY(${(1 - opacity) * 24}px)` }}
            >
              <span className="font-mono text-xs tracking-[0.35em] text-white/75">{label}</span>
              <h2 className="mt-3 font-semibold tracking-tight leading-none text-5xl sm:text-7xl lg:text-8xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                {title}
              </h2>
            </div>
          );
        })}

        {/* Alt çizgi: videonun neresinde olunduğunu gösterir */}
        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-8 pb-6">
          <div className="h-px bg-white/30 relative">
            <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${progress * 100}%` }} />
            <div className="absolute -top-1 h-[9px] w-[3px] bg-accent" style={{ left: `calc(${progress * 100}% - 1px)` }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-start gap-4 pt-4 text-white">
            <span className="hidden sm:block font-mono text-xs tracking-widest text-white/70">02 — YOLDA</span>
            <p className="text-center text-sm text-white/85 min-h-5">
              {car && (
                <>
                  {carTitle(car)} · {car.year} · {formatPrice(car.price)} ·{' '}
                  {car.isAvailable ? (
                    <button type="button" onClick={() => openReserve(car.id)} className="inline-block py-1.5 underline underline-offset-4 hover:text-white">
                      Özel Sunum Talep Et
                    </button>
                  ) : (
                    <span className="text-white/60">Satış sürecinde</span>
                  )}
                </>
              )}
            </p>
            <span className="hidden sm:block text-right font-mono text-xs tracking-widest text-white/70">
              {progress < 0.97 ? 'KAYDIRMAYA DEVAM EDİN ↓' : 'KOLEKSİYONU KEŞFEDİN ↓'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
