import React, { useEffect, useRef, useState } from 'react';
import { HERO_CONTENT as content, HERO_VIDEO as video } from '../constants/heroCars';
import { useCarStore } from '../store/useCarStore';
import { carTitle, formatPrice } from '../utils/format';
import type { Car } from '../types/car';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Hero: React.FC<{ cars: Car[] }> = ({ cars }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openReserve, openFleet } = useCarStore();
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  // Telefonda daha hafif video; ilk render'da bir kez seçilir
  const [src] = useState(() => (window.innerWidth < 768 ? video.srcMobile : video.src));

  const heroCars = content.carIds
    .map((id) => cars.find((car) => car.id === id))
    .filter((car): car is Car => Boolean(car));

  // Video ekrandan çıkınca durur, geri gelince devam eder (pil ve işlemci tasarrufu).
  // "Hareketi azalt" ayarı açık olanlarda otomatik oynatılmaz, kapak görseli kalır.
  useEffect(() => {
    const el = videoRef.current;
    const section = sectionRef.current;
    if (!el || !section || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[560px] overflow-hidden bg-black">
      {videoFailed ? (
        <img src={video.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={video.poster}
          autoPlay={!prefersReducedMotion()}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onTimeUpdate={(e) => {
            const { currentTime, duration } = e.currentTarget;
            if (duration) setVideoProgress(currentTime / duration);
          }}
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Yazıların okunması için alt kısmı karartır */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70 pointer-events-none" />

      <h1 className="absolute inset-x-4 bottom-40 sm:bottom-32 text-center text-white font-semibold tracking-tight leading-none text-5xl sm:text-7xl lg:text-8xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
        {content.title}
      </h1>

      {/* Alt bilgi çubuğu: çizgi videonun ilerleyişini gösterir */}
      <div className="absolute inset-x-0 bottom-0 px-4 sm:px-8 pb-6 text-white">
        <div className="h-px bg-white/30 relative">
          <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${videoProgress * 100}%` }} />
          <div className="absolute -top-1 h-[9px] w-[3px] bg-accent" style={{ left: `calc(${videoProgress * 100}% - 1px)` }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-start gap-4 pt-4">
          <span className="hidden sm:block font-mono text-xs tracking-widest text-white/70">{content.label}</span>
          <div className="text-center text-sm text-white/85 space-y-1 min-h-10">
            {heroCars.map((car) => (
              <p key={car.id}>
                {carTitle(car)} · {car.year} · {formatPrice(car.price)} ·{' '}
                {car.isAvailable ? (
                  <button type="button" onClick={() => openReserve(car.id)} className="underline underline-offset-4 hover:text-white">
                    Özel Sunum Talep Et
                  </button>
                ) : (
                  <span className="text-white/60">Satış sürecinde</span>
                )}
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openFleet('All')}
            className="hidden sm:block font-mono text-xs tracking-widest text-white/70 hover:text-white text-right"
          >
            TÜM ARAÇLAR →
          </button>
        </div>
      </div>
    </section>
  );
};
