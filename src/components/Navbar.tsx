import React, { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';
import { useCarStore } from '../store/useCarStore';
import { EMAIL, PHONE } from '../constants/contact';
import { CATEGORY_LABELS } from '../constants/categories';
import { carTitle, formatPrice } from '../utils/format';
import { matchesSearch } from '../utils/search';
import type { Car, Category } from '../types/car';

interface MenuItem {
  label: string;
  /** Verilirse katalog bu kategoriyle açılır; yoksa `to` sayfasına gidilir */
  category?: Category | 'All';
  to?: string;
  image: string;
  note: string;
}

const MENU: MenuItem[] = [
  { label: 'Arazi', category: 'Off-Road', image: '/cars/defender/1.jpg', note: 'Dağ, kum ve dere yatakları için' },
  { label: 'Lüks', category: 'Luxury', image: '/cars/g-500/1.jpg', note: 'Prestij ve konfor bir arada' },
  { label: 'Koleksiyon', category: 'All', image: '/cars/rr-sport/1.jpg', note: 'Tüm modeller tek sayfada' },
  { label: 'İletişim', to: '/iletisim', image: '/experience/parasut.jpg', note: `${PHONE.display} · ${EMAIL}` },
];

const BAR_LINKS: { label: string; category: Category | 'All' }[] = [
  { label: 'ARAZİ', category: 'Off-Road' },
  { label: 'LÜKS', category: 'Luxury' },
  { label: 'KOLEKSİYON', category: 'All' },
];

const ease = [0.2, 0.8, 0.2, 1] as const;

// Üst çubuk: ana videonun üzerinde şeffaf ve beyaz yazılı; aşağıda açık zeminli düz bir şerit.
// Aşağı kaydırırken gizlenir, yukarı kaydırınca görünür. Menü tam ekran açılır.
export const Navbar: React.FC<{ cars: Car[] }> = ({ cars }) => {
  const { openFleet, closeFleet, fleetOpen, openReserve, openDetail } = useCarStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Koyu bir üst alanla başlayan sayfalarda navbar şeffaf/beyaz başlar
  const darkTop = pathname === '/' || pathname === '/iletisim';
  const [hidden, setHidden] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState(0);
  const lastY = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setOverHero(y < window.innerHeight - 90);
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      setHidden(delta > 0 && y > 80);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (!fleetOpen) document.body.style.overflow = '';
    };
  }, [menuOpen, fleetOpen]);

  const go = (category: Category | 'All', search = '') => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery('');
    openFleet(category, search);
  };

  const select = (item: MenuItem) => {
    if (item.category) return go(item.category);
    setMenuOpen(false);
    closeFleet();
    if (item.to) navigate(item.to);
  };

  const results = query.trim() ? cars.filter((car) => matchesSearch(car, query)) : [];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) go('All', query.trim());
  };

  // Sadece ana sayfadaki videonun üstünde (ve katalog açık değilken) şeffaf/beyaz yazı
  const light = darkTop && overHero && !fleetOpen && !searchOpen;
  const visible = !hidden || searchOpen || fleetOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${
          light
            ? 'bg-gradient-to-b from-black/45 to-transparent text-white'
            : 'bg-[#f4f2ee]/92 backdrop-blur-md text-[#162231] shadow-[0_1px_0_rgba(0,0,0,0.08)]'
        }`}
      >
        <nav className="mx-auto max-w-[1720px] h-[72px] px-5 sm:px-10 grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          {/* Sol: logo */}
          <Link
            to="/"
            onClick={() => {
              setMenuOpen(false);
              closeFleet();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Vanguard Automotive ana sayfa"
            className="justify-self-start"
          >
            <Logo />
          </Link>

          {/* Orta: linkler ya da arama */}
          <div className="justify-self-center">
            {searchOpen ? (
              <form id="nav-search" onSubmit={submitSearch} className="w-[min(60vw,22rem)]">
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                  placeholder="Marka, model ya da kategori ara"
                  aria-label="Araç ara"
                  className="w-full bg-transparent border-b border-current/30 py-1.5 text-sm placeholder:opacity-50 focus:outline-none"
                />
              </form>
            ) : (
              <ul className="hidden lg:flex items-center gap-12 font-mono text-[11px] tracking-[0.3em]">
                {BAR_LINKS.map((link) => (
                  <li key={link.label}>
                    <button type="button" onClick={() => go(link.category)} className="group relative py-2">
                      {link.label}
                      <span className="absolute left-0 right-[0.3em] bottom-0 h-px bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sağ: arama · rezervasyon · menü */}
          <div className="justify-self-end flex items-center gap-1 sm:gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label={searchOpen ? 'Aramayı kapat' : 'Ara'}
              className="w-10 h-10 flex items-center justify-center opacity-80 hover:opacity-100"
            >
              {searchOpen ? <X className="w-[18px] h-[18px]" strokeWidth={1.25} /> : <Search className="w-[18px] h-[18px]" strokeWidth={1.25} />}
            </button>
            <span aria-hidden="true" className="hidden sm:block h-5 w-px bg-current opacity-25" />
            <button
              type="button"
              onClick={() => openReserve()}
              className={`hidden sm:block px-5 py-2.5 font-mono text-[11px] tracking-[0.3em] transition-colors ${
                light ? 'border border-white/60 hover:bg-white hover:text-[#1c1e22]' : 'bg-[#1c1e22] text-[#f1ece2] hover:bg-[#c9a96e] hover:text-[#1c1e22]'
              }`}
            >
              ÖZEL SUNUM
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-label="Menüyü aç"
              className="group w-11 h-11 flex flex-col items-end justify-center gap-[7px]"
            >
              <span className="block h-px w-7 bg-current transition-all group-hover:w-5" />
              <span className="block h-px w-5 bg-current transition-all group-hover:w-7" />
            </button>
          </div>
        </nav>

        {/* Arama önerileri: yazdıkça eşleşen araçlar */}
        <AnimatePresence>
          {searchOpen && query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease }}
              className="absolute left-1/2 top-full mt-2 w-[min(92vw,30rem)] -translate-x-1/2 bg-[#f4f2ee] text-[#162231] shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
            >
              {results.length === 0 ? (
                <p className="px-5 py-6 text-sm text-gray-500">
                  “{query.trim()}” için sonuç bulunamadı. Marka (ör. Toyota), model (ör. Defender) ya da kategori (Arazi, Lüks)
                  deneyin.
                </p>
              ) : (
                <>
                  <ul className="divide-y divide-black/5">
                    {results.slice(0, 5).map((car) => (
                      <li key={car.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery('');
                            openDetail(car.id);
                          }}
                          className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-black/[0.04] transition-colors"
                        >
                          <img src={car.image} alt="" className="h-11 w-16 shrink-0 object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{carTitle(car)}</span>
                            <span className="block font-mono text-[10px] tracking-[0.2em] text-gray-500">
                              {CATEGORY_LABELS[car.category].toLocaleUpperCase('tr-TR')} · {car.year}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm text-gray-700">{formatPrice(car.price)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="submit"
                    form="nav-search"
                    className="flex w-full items-center justify-between border-t border-black/10 px-5 py-3.5 font-mono text-[11px] tracking-[0.25em] hover:bg-black/[0.04]"
                  >
                    TÜM SONUÇLARI GÖR ({results.length})
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Tam ekran menü */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[70] bg-[#111418] text-white overflow-y-auto"
          >
            <div className="mx-auto max-w-[1720px] h-[72px] px-5 sm:px-10 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-white/70 hover:text-white"
              >
                KAPAT <X className="w-5 h-5" strokeWidth={1.25} />
              </button>
            </div>

            <div className="mx-auto max-w-[1720px] px-5 sm:px-10 pt-8 sm:pt-14 pb-12 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:min-h-[calc(100svh-72px)]">
              <ul className="divide-y divide-white/10 border-y border-white/10 max-w-xl">
                {MENU.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.25 + i * 0.07 }}
                  >
                    <button
                      type="button"
                      onClick={() => select(item)}
                      onMouseEnter={() => setPreview(i)}
                      onFocus={() => setPreview(i)}
                      className="group flex w-full items-center gap-5 sm:gap-8 py-5 sm:py-6 text-left"
                    >
                      <span className="font-mono text-[10px] tracking-widest text-white/35 w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span
                        className={`flex-1 font-serif font-normal leading-none text-[clamp(1.8rem,3.2vw,2.9rem)] transition-all duration-500 ${
                          preview === i ? 'text-white translate-x-1' : 'text-white/40'
                        }`}
                      >
                        {item.label}
                      </span>
                      <ArrowUpRight
                        className={`w-5 h-5 transition-all duration-300 ${preview === i ? 'opacity-100 text-[#c9a96e]' : 'opacity-0 -translate-x-2'}`}
                        strokeWidth={1.25}
                      />
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* Üzerine gelinen bağlantının görseli */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.35 }}
                className="relative aspect-[16/10] lg:aspect-[4/5] max-h-[62vh] w-full lg:max-w-[460px] lg:justify-self-end overflow-hidden rounded-sm"
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={MENU[preview].image}
                    src={MENU[preview].image}
                    alt=""
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-6 left-6 right-6 font-mono text-[11px] tracking-[0.25em] text-white/85">
                  {MENU[preview].note.toLocaleUpperCase('tr-TR')}
                </p>
              </motion.div>
            </div>

            <div className="mx-auto max-w-[1720px] px-5 sm:px-10 pb-8 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[11px] tracking-[0.25em] text-white/45">
              <a href={PHONE.href} className="text-white hover:text-[#e2cc9b]">
                HEMEN ARAYIN · {PHONE.display}
              </a>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openReserve();
                }}
                className="flex items-center gap-2.5 text-[#e2cc9b] hover:text-white"
              >
                <span aria-hidden="true" className="w-1.5 h-1.5 bg-[#c9a96e]" /> SHOWROOM RANDEVUSU AL
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
