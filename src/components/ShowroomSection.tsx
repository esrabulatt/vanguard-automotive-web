import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { PHONE, SHOWROOM } from '../constants/contact';
import { Link } from 'react-router-dom';
import { useCarStore } from '../store/useCarStore';

const ease = [0.2, 0.8, 0.2, 1] as const;

// Ana sayfanın altında editoryal "Showroom Deneyimi": solda loş lounge görseli, sağda davet ve randevu
export const ShowroomSection: React.FC = () => {
  const openReserve = useCarStore((state) => state.openReserve);
  // Üst üste binen iki görselden hangisi önde
  const [front, setFront] = useState<'lounge' | 'keys'>('keys');

  return (
    <section id="showroom" className="bg-[#16181b] text-[#f1ece2] px-4 sm:px-10 py-20 sm:py-32">
      <div className="mx-auto max-w-[1400px] grid gap-14 lg:grid-cols-2 lg:gap-24 lg:items-center">
        {/* Görseller: büyük lounge, üzerine binen küçük kare. Fareyle hangisinin üzerine gelinirse o öne
            geçer; diğeri biraz kenara kayıp küçülür, böylece ikisi de görünür kalır */}
        <div className="relative pb-16 sm:pb-24 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(12% 0 0 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease }}
            onMouseEnter={() => setFront('lounge')}
            className="relative w-[88%]"
            style={{ zIndex: front === 'lounge' ? 20 : 10 }}
          >
            <div
              className={`relative aspect-[4/3] overflow-hidden transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                front === 'lounge' ? 'scale-[1.02] shadow-[0_30px_70px_rgba(0,0,0,0.55)]' : ''
              }`}
            >
              <img
                src="/experience/showroom-lounge.jpg"
                alt="Vanguard Automotive showroom lounge'unda kahve eşliğinde görüşme"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '62% 50%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease, delay: 0.25 }}
            onMouseEnter={() => setFront('keys')}
            className="absolute right-0 bottom-0 lg:-bottom-10 w-[40%]"
            style={{ zIndex: front === 'keys' ? 20 : 10 }}
          >
            <div
              className={`aspect-[4/5] overflow-hidden border-[6px] sm:border-8 border-[#16181b] transition-[transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                front === 'keys'
                  ? 'shadow-[0_30px_60px_rgba(0,0,0,0.5)]'
                  : 'translate-x-[14%] translate-y-[10%] scale-[0.9] opacity-80 shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
              }`}
            >
              <img
                src="/experience/showroom-anahtar.jpg"
                alt="Anahtar teslimi"
                loading="lazy"
                className="w-full h-full object-cover"
                style={{ objectPosition: '48% 50%' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Metin ve randevu */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
        >
          <p className="flex items-center gap-4 font-mono text-[11px] tracking-[0.4em] text-[#c9a96e]">
            <span aria-hidden="true" className="h-px w-10 bg-[#c9a96e]" />
            ÖZEL BULUŞMA NOKTASI
          </p>
          <h2 className="mt-6 font-serif font-medium leading-[1.02] text-[clamp(2.8rem,5.5vw,5.5rem)]">
            Showroom'da
            <br />
            <span className="italic text-[#e2cc9b]">Kahvemizi İçin.</span>
          </h2>
          <p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-[#f1ece2]/60">
            Aceleye gerek yok. Size ayrılmış lounge'umuzda, koleksiyonu portföy yöneticinizle birlikte, kendi temponuzda
            keşfedin.
          </p>

          <dl className="mt-10 grid gap-px sm:grid-cols-2 bg-[#f1ece2]/10 border-y border-[#f1ece2]/10">
            <div className="bg-[#16181b] py-5 sm:pr-6">
              <dt className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#f1ece2]/45">
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> LOKASYON
              </dt>
              <dd className="mt-2">
                <a href={SHOWROOM.mapsUrl} target="_blank" rel="noreferrer" className="group">
                  <span className="block font-serif text-2xl">{SHOWROOM.area}</span>
                  <span className="text-sm text-[#f1ece2]/60 group-hover:text-[#e2cc9b] transition-colors">
                    {SHOWROOM.district} ↗
                  </span>
                </a>
              </dd>
            </div>
            <div className="bg-[#16181b] py-5 sm:pl-6">
              <dt className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#f1ece2]/45">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> ÇALIŞMA SAATLERİ
              </dt>
              <dd className="mt-2">
                <span className="block font-serif text-2xl [font-variant-numeric:lining-nums]">{SHOWROOM.hours}</span>
                <span className="text-sm text-[#f1ece2]/60">{SHOWROOM.closed}</span>
              </dd>
            </div>
          </dl>

          <a
            href={PHONE.href}
            className="group mt-6 flex items-baseline gap-4 border-b border-[#f1ece2]/10 pb-5"
          >
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#f1ece2]/45">
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} /> HEMEN ARAYIN
            </span>
            <span className="font-serif text-2xl [font-variant-numeric:lining-nums] group-hover:text-[#e2cc9b] transition-colors">
              {PHONE.display}
            </span>
          </a>

          <Link
            to="/iletisim"
            className="mt-6 block font-mono text-[11px] tracking-[0.3em] text-[#f1ece2]/55 hover:text-[#e2cc9b] transition-colors"
          >
            ADRES, ULAŞIM &amp; VALE BİLGİSİ →
          </Link>

          <button
            type="button"
            onClick={() => openReserve(null, 'showroom')}
            className="group mt-10 inline-flex items-center gap-4 bg-[#c9a96e] hover:bg-[#e2cc9b] px-8 sm:px-10 py-5 font-mono text-[11px] sm:text-xs tracking-[0.25em] text-[#1c1e22] transition-colors"
          >
            SHOWROOM RANDEVUSU OLUŞTUR
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* Geniş şerit: Vanguard tabelası önünde anahtar teslimi */}
      <motion.figure
        initial={{ opacity: 0, clipPath: 'inset(0 8% 0 8%)' }}
        whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease }}
        className="relative mx-auto mt-24 sm:mt-36 max-w-[1400px] sm:aspect-[21/9] overflow-hidden"
      >
        <img
          src="/experience/showroom-teslim.jpg"
          alt="Vanguard Automotive showroom'unda Range Rover teslimi"
          loading="lazy"
          className="w-full aspect-[16/9] sm:aspect-auto sm:absolute sm:inset-0 sm:h-full object-cover"
          style={{ objectPosition: '60% 45%' }}
        />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <figcaption className="mt-5 sm:mt-0 sm:absolute sm:left-12 sm:bottom-12 max-w-md">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.35em] text-[#c9a96e]">TESLİMAT</p>
          <p className="mt-2 sm:mt-3 font-serif text-2xl sm:text-5xl leading-tight">
            Anahtarınız,
            <br />
            <span className="italic text-[#e2cc9b]">Vanguard güvencesiyle.</span>
          </p>
        </figcaption>
      </motion.figure>
    </section>
  );
};
