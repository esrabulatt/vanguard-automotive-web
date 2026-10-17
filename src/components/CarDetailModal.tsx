import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, FileDown, MessageCircle } from 'lucide-react';
import { PHONE, whatsappLink } from '../constants/contact';
import { accelerationTr, fuelTr, gearTr, powerTr } from '../utils/specs';
import { CATEGORY_LABELS } from '../constants/categories';
import { useCarStore } from '../store/useCarStore';
import { carTitle, formatPrice } from '../utils/format';
import { preloadImages } from '../utils/preload';
import type { Car, StoryBlock } from '../types/car';

// API'de açıklaması olmayan görseller için yedek metin
const fallbackStory = (car: Car, i: number): StoryBlock =>
  i === 0
    ? { title: carTitle(car), text: `${powerTr(car)} gücü, ${accelerationTr(car)} 0-100 hızlanma ve ${car.specs.seats} kişilik kabin.` }
    : { title: car.features[i - 1] ?? carTitle(car), text: car.features.join(' · ') };

/** Ekrana giren öğeye "is-visible" ekler (scroll ile beliren yazılar) */
const useReveal = (root: React.RefObject<HTMLElement | null>, deps: unknown) => {
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { root: container, threshold: 0.25 },
    );
    container.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [root, deps]);
};

// Detay sayfası: tam ekran görsel → açıklama → tam ekran görsel → açıklama ... → teknik bilgiler.
// Not: App bu bileşeni key ile render eder; başka araç seçilince sayfa baştan başlar.
export const CarDetailModal: React.FC<{ cars: Car[] }> = ({ cars }) => {
  const { detailCarId, closeDetail, openReserve } = useCarStore();
  const car = cars.find((c) => c.id === detailCarId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [scrolled, setScrolled] = useState(false);
  // Aşağı kaydırırken üst çubuk gizlenir, yukarı kaydırınca (veya en üstte) görünür
  const [barHidden, setBarHidden] = useState(false);
  const lastY = useRef(0);

  const photos = car ? (car.gallery.length > 0 ? car.gallery : [car.image]) : [];
  useReveal(scrollRef, car?.id);

  useEffect(() => {
    if (!car) return;
    preloadImages(photos);
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && closeDetail();
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
    // photos her render'da yeni dizi; araç değişmedikçe tekrar çalışmasına gerek yok
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car, closeDetail]);

  if (!car) return null;

  // Her sahnede ilerlemeye (0-1) göre görsel yavaşça yakınlaşır, açıklama geldikçe kararır
  const animateScenes = (container: HTMLElement) => {
    if (reducedMotion) return;
    const view = container.clientHeight;
    container.querySelectorAll<HTMLElement>('[data-scene]').forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - view)));
      const img = scene.querySelector<HTMLElement>('[data-scene-img]');
      const shade = scene.querySelector<HTMLElement>('[data-scene-shade]');
      if (img) img.style.transform = `scale(${1.04 + progress * 0.12})`;
      if (shade) shade.style.opacity = String(Math.min(0.55, progress * 1.4));
    });
  };

  const reserve = () => {
    closeDetail();
    openReserve(car.id);
  };

  const specs = [
    ['YIL', String(car.year)],
    ['GÜÇ', powerTr(car)],
    ['0-100 KM/S', accelerationTr(car)],
    ['KOLTUK', `${car.specs.seats} kişi`],
    ['VİTES', gearTr(car)],
    ['YAKIT', fuelTr(car)],
  ];

  return (
    <div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onScroll={(e) => {
        const y = e.currentTarget.scrollTop;
        setScrolled(y > 40);
        if (Math.abs(y - lastY.current) >= 6) {
          setBarHidden(y > lastY.current && y > 80);
          lastY.current = y;
        }
        animateScenes(e.currentTarget);
      }}
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-[#f4f2ee] animate-card-in"
    >
      {/* Üst çubuk: geri, araç adı, özel sunum */}
      <header
        className={`fixed top-0 inset-x-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-8 h-16 transition-[transform,background-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          barHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled ? 'bg-[#f4f2ee]/95 backdrop-blur text-gray-900 shadow-sm' : 'text-white'
        }`}
      >
        <button
          type="button"
          onClick={closeDetail}
          className="flex items-center gap-2 py-3 font-mono text-xs tracking-wider hover:text-[#c9a96e] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> GERİ
        </button>
        <span className={`hidden sm:block font-mono text-xs tracking-[0.25em] transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
          {carTitle(car).toUpperCase()}
        </span>
        <button
          type="button"
          onClick={reserve}
          disabled={!car.isAvailable}
          className="bg-[#c9a96e] hover:bg-[#1c1e22] hover:text-white disabled:bg-gray-400 text-[#1c1e22] px-4 py-2 font-mono text-[11px] tracking-wider transition-colors"
        >
          {car.isAvailable ? 'ÖZEL SUNUM' : 'SATIŞ SÜRECİNDE'}
        </button>
      </header>

      {/* Sahneler: görsel ekrana sabitlenir, açıklama kartı alttan kayarak üstüne gelir,
          sonraki görsel öncekinin üzerine kayar */}
      {photos.map((src, i) => {
        const block = car.story?.[i] ?? fallbackStory(car, i);
        const onRight = i % 2 === 1;
        return (
          <section key={src} data-scene className="relative bg-black" style={{ height: '230svh' }}>
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              {i === 0 && car.video ? (
                // Açılış videosu: sessiz başlar ve döner
                <video
                  data-scene-img
                  src={window.innerWidth < 768 && car.video.srcMobile ? car.video.srcMobile : car.video.src}
                  poster={car.video.poster ?? src}
                  autoPlay={!reducedMotion}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  style={{ transform: 'scale(1.04)' }}
                />
              ) : (
                <img
                  data-scene-img
                  src={src}
                  alt={`${carTitle(car)} — ${block.title}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  style={{ transform: 'scale(1.04)' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
              <div data-scene-shade className="absolute inset-0 bg-black opacity-0" />
            </div>

            {/* İlk ekran: görsel tek başına (açılışta araç adı ve fiyat) */}
            <div className="relative -mt-[100svh] h-[100svh] flex items-end">
              {i === 0 && (
                <div className="px-4 sm:px-12 pb-10 sm:pb-14 text-white">
                  <p className="font-mono text-xs tracking-[0.35em] text-white/80">
                    {CATEGORY_LABELS[car.category].toLocaleUpperCase('tr-TR')} · {car.year}
                  </p>
                  <h2 id="detail-title" className="mt-2 font-semibold tracking-tight leading-none text-5xl sm:text-7xl lg:text-8xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                    {carTitle(car)}
                  </h2>
                  <p className="mt-4 text-lg sm:text-2xl text-white/90">{formatPrice(car.price)}</p>
                  <p className="mt-8 font-mono text-[11px] tracking-[0.3em] text-white/70 animate-pulse">AŞAĞI KAYDIRIN ↓</p>
                </div>
              )}
            </div>

            {/* Görselin üstüne kayan açıklama kartı */}
            <div className={`relative min-h-[100svh] flex items-center px-4 sm:px-12 ${onRight ? 'sm:justify-end' : ''}`}>
              <div className="reveal w-full max-w-xl rounded-2xl border border-white/15 bg-black/35 backdrop-blur-md p-7 sm:p-10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-6xl sm:text-7xl leading-none text-white/25">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-[11px] tracking-[0.3em] text-[#c9a96e]">
                    {i + 1} / {photos.length}
                  </span>
                </div>
                <h3 className="mt-4 font-serif font-semibold text-3xl sm:text-5xl leading-tight">{block.title}</h3>
                <div className="mt-5 h-px w-16 bg-[#c9a96e]" />
                <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/85">{block.text}</p>
              </div>
            </div>
          </section>
        );
      })}

      {/* Teknik bilgiler ve satın alma */}
      <section className="bg-[#1c1e22] text-[#f1ece2] px-4 sm:px-12 py-20 sm:py-28">
        <div className="reveal max-w-4xl mx-auto">
          <span className="font-mono text-xs tracking-[0.35em] text-[#c9a96e]">TEKNİK ÖZELLİKLER</span>
          <h3 className="mt-3 font-serif text-4xl sm:text-6xl font-medium tracking-tight [font-variant-numeric:lining-nums]">{carTitle(car)}</h3>

          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-px bg-[#c9a96e]/15 border border-[#c9a96e]/15">
            {specs.map(([label, value]) => (
              <div key={label} className="bg-[#1c1e22] p-5">
                <dt className="font-mono text-[10px] tracking-[0.2em] text-[#f1ece2]/45">{label}</dt>
                <dd className="mt-2 text-lg font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <h4 className="mt-10 font-mono text-[11px] tracking-[0.25em] text-[#f1ece2]/45">DONANIM</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {car.features.map((feature) => (
              <li key={feature} className="border border-[#f1ece2]/15 px-3 py-1.5 text-sm text-[#f1ece2]/80">
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-8 border-t border-[#c9a96e]/20 pt-10">
            <div>
              <p className="font-mono text-[11px] tracking-[0.25em] text-[#f1ece2]/45">SATIŞ FİYATI</p>
              <p className="mt-2 font-serif text-4xl sm:text-5xl [font-variant-numeric:lining-nums]">{formatPrice(car.price)}</p>
              <span className="mt-4 inline-flex items-center gap-2 whitespace-nowrap border border-[#c9a96e]/50 bg-[#c9a96e]/10 px-3 py-1.5 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#e2cc9b]">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
                %20 KDV AVANTAJI · HEMEN TESLİM
              </span>
              <div className="mt-4">
                {car.reportUrl ? (
                  <a
                    href={car.reportUrl}
                    download
                    className="inline-flex items-center gap-2 py-2 text-sm text-[#f1ece2]/70 underline underline-offset-4 decoration-[#c9a96e]/50 hover:text-[#f1ece2]"
                  >
                    <FileDown className="w-4 h-4" strokeWidth={1.5} /> Ekspertiz Raporu (PDF)
                  </a>
                ) : (
                  <a
                    href={whatsappLink(`Merhaba, ${carTitle(car)} için ekspertiz raporunu talep ediyorum.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 py-2 text-sm text-[#f1ece2]/70 underline underline-offset-4 decoration-[#c9a96e]/50 hover:text-[#f1ece2]"
                  >
                    <FileDown className="w-4 h-4" strokeWidth={1.5} /> Ekspertiz Raporu (PDF) talep et
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={reserve}
                disabled={!car.isAvailable}
                className="bg-[#c9a96e] hover:bg-[#e2cc9b] disabled:bg-[#f1ece2]/15 disabled:text-[#f1ece2]/40 disabled:cursor-not-allowed whitespace-nowrap text-[#1c1e22] px-8 py-4 font-mono text-xs tracking-[0.2em] transition-colors"
              >
                {car.isAvailable ? 'ÖZEL SUNUM TALEP ET' : 'BU ARAÇ SATIŞ SÜRECİNDE'}
              </button>
              <a
                href={whatsappLink(`Merhaba, ${carTitle(car)} (${formatPrice(car.price)}) hakkında bilgi almak istiyorum.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap border border-[#f1ece2]/35 hover:border-[#c9a96e] hover:text-[#e2cc9b] px-5 sm:px-8 py-4 font-mono text-[11px] sm:text-xs tracking-[0.12em] sm:tracking-[0.2em] transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                DANIŞMANLA WHATSAPP'TAN GÖRÜŞ
              </a>
            </div>
            <p className="text-sm text-[#f1ece2]/55">
              Hemen bilgi almak için{' '}
              <a href={PHONE.href} className="inline-block py-1.5 whitespace-nowrap text-[#f1ece2] underline underline-offset-4 decoration-[#c9a96e]/60 hover:text-[#e2cc9b]">
                {PHONE.display}
              </a>{' '}
              numaralı hattımızdan bizi arayabilirsiniz.
            </p>
          </div>

          <button
            type="button"
            onClick={closeDetail}
            className="mt-11 py-3 font-mono text-xs tracking-wider text-[#f1ece2]/50 hover:text-[#f1ece2]"
          >
            ← TÜM ARAÇLARA DÖN
          </button>
        </div>
      </section>
    </div>
  );
};
