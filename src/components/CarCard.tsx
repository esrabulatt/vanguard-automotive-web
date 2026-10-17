import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCarStore } from '../store/useCarStore';
import { CATEGORY_LABELS } from '../constants/categories';
import { carTitle, formatPrice } from '../utils/format';
import { preloadImages } from '../utils/preload';
import type { Car } from '../types/car';

// Katalog kartı: geniş sinematik görsel (üzerinde yazı yok), altında tek temiz satır bilgi
export const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const openDetail = useCarStore((state) => state.openDetail);
  // Üzerine gelince galeriyi önceden yükle; detay ekranı açılınca görseller hazır olur
  const warmUp = () => preloadImages(car.gallery);
  const open = () => openDetail(car.id);

  return (
    <article id={car.id} onMouseEnter={warmUp} onTouchStart={warmUp} className="group min-w-0 scroll-mt-32">
      <button
        type="button"
        onClick={open}
        aria-label={`${carTitle(car)} detayları`}
        className="relative block w-full aspect-[16/10] overflow-hidden rounded-md bg-gray-200"
      >
        <img
          src={car.image}
          alt={carTitle(car)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
        />
        {!car.isAvailable && (
          <span className="absolute top-4 left-4 bg-white/90 font-mono text-[10px] tracking-[0.2em] text-gray-900 px-2.5 py-1">
            SATIŞ SÜRECİNDE
          </span>
        )}
      </button>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900 truncate">{carTitle(car)}</h3>
          <p className="mt-1.5 font-mono text-[11px] tracking-wider text-gray-500">
            {CATEGORY_LABELS[car.category].toLocaleUpperCase('tr-TR')} · {car.year} · {car.specs.rangeOrHorsepower.toUpperCase()} ·{' '}
            {car.specs.seats} KİŞİ
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg sm:text-xl font-medium text-gray-900">{formatPrice(car.price)}</p>
          <button
            type="button"
            onClick={open}
            className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em] text-gray-900 border-b border-transparent hover:border-gray-900 transition-colors"
          >
            İNCELE <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
};
