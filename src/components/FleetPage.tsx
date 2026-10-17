import React, { useEffect, useMemo, useRef } from 'react';
import { CatalogHero } from './CatalogHero';
import { matchesSearch } from '../utils/search';
import { CarCard } from './CarCard';
import { CATEGORY_FILTERS } from '../constants/categories';
import { useCarStore } from '../store/useCarStore';
import type { Car, Category } from '../types/car';

// Seçili kategoriye göre sayfa başlığı ve açıklaması
const COPY: Record<Category | 'All', { title: string; text: string }> = {
  All: {
    title: 'Özel Koleksiyon',
    text: 'Her araziye hazır, her yolculuğa layık. Dilediğiniz modeli showroomumuzda ya da adresinizde size özel sunalım.',
  },
  'Off-Road': {
    title: 'Arazi Koleksiyonu',
    text: 'Dere yatağından dağ geçidine; asfaltın bittiği yerde başlayan, gerçek arazi karakterli modeller.',
  },
  Luxury: {
    title: 'Lüks Koleksiyon',
    text: 'Şehirde sessiz bir zarafet, arazide sarsılmaz bir güç. Konforun en sağlam hâli.',
  },
};

interface Props {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

// Katalog sayfası ("Özel Koleksiyon"): hamburger menüden açılan tam ekran sayfa.
// Üstte Arazi vs Lüks kapak görseli, ardından başlık, yatay filtreler ve 2 sütunlu geniş araç kartları.
export const FleetPage: React.FC<Props> = ({ cars, loading, error }) => {
  const headerRef = useRef<HTMLElement>(null);
  const { fleetOpen, closeFleet, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useCarStore();

  useEffect(() => {
    if (!fleetOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && !document.querySelector('[role=dialog]') && closeFleet();
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [fleetOpen, closeFleet]);

  // Navbar'daki aramadan gelinirse sonuçlar aranan metne göre süzülür
  const filteredCars = useMemo(
    () => cars.filter((car) => (selectedCategory === 'All' || car.category === selectedCategory) && matchesSearch(car, searchQuery)),
    [cars, selectedCategory, searchQuery],
  );

  const categoryCount = cars.filter((car) => selectedCategory === 'All' || car.category === selectedCategory).length;

  if (!fleetOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[#f4f2ee] animate-card-in">
      <CatalogHero cars={cars} category={selectedCategory} onScrollDown={() => headerRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      <main id="filo" className="pt-20 sm:pt-28 pb-24">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10">
          {/* Başlık */}
          <header ref={headerRef} className="scroll-mt-24 text-center">
            <p className="inline-block border border-[#c9a96e]/60 px-3 py-1 font-mono text-[10px] tracking-[0.35em] text-[#8a7559]">
              {categoryCount} MODEL
            </p>
            <h1
              key={selectedCategory}
              className="animate-card-in mt-4 font-serif font-medium tracking-tight text-gray-900 text-[clamp(3rem,7vw,6.5rem)] leading-none"
            >
              {COPY[selectedCategory].title}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base text-gray-500">{COPY[selectedCategory].text}</p>
          </header>

          {/* Yatay kategori filtreleri */}
          <nav aria-label="Kategoriler" className="mt-12 flex justify-center gap-8 sm:gap-12 border-b border-black/10">
            {CATEGORY_FILTERS.map((category) => {
              const isActive = selectedCategory === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  aria-pressed={isActive}
                  className={`relative -mb-px pb-4 font-mono text-xs sm:text-sm tracking-[0.25em] transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {category.label.toLocaleUpperCase('tr-TR')}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-[2px] bg-gray-900 transition-transform duration-500 origin-center ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {searchQuery && (
            <p className="mt-8 text-center text-sm text-gray-600">
              “{searchQuery}” için {filteredCars.length} sonuç ·{' '}
              <button type="button" onClick={() => setSearchQuery('')} className="underline underline-offset-4 hover:text-gray-900">
                Aramayı temizle
              </button>
            </p>
          )}

          {/* Araçlar */}
          <div className="mt-14 sm:mt-16">
            {loading ? (
              <p className="text-center text-gray-500">Araçlar yükleniyor...</p>
            ) : error ? (
              <p className="text-center text-red-500">
                {error} — API çalışıyor mu? (<code>cd ~/rent-a-car-api && npm run dev</code>)
              </p>
            ) : (
              <div key={selectedCategory} className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 md:grid-cols-2 animate-card-in">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-24 text-center">
            <button
              type="button"
              onClick={closeFleet}
              className="font-mono text-xs tracking-[0.3em] text-gray-500 hover:text-gray-900"
            >
              ← ANA SAYFAYA DÖN
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
