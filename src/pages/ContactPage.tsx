import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Car as CarIcon, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { EMAIL, PHONE, SHOWROOM, whatsappLink } from '../constants/contact';
import { useCarStore } from '../store/useCarStore';

const ease = [0.2, 0.8, 0.2, 1] as const;
const label = 'flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#f1ece2]/45';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 1, ease, delay },
});

// /iletisim — Showroom & Danışmanlık sayfası (koyu antrasit / bej)
export const ContactPage: React.FC = () => {
  const openReserve = useCarStore((state) => state.openReserve);

  useEffect(() => {
    document.title = 'İletişim & Showroom — Vanguard Automotive';
    return () => {
      document.title = 'Vanguard Automotive — Lüks Butik Galeri';
    };
  }, []);

  return (
    <main className="bg-[#16181b] text-[#f1ece2]">
      {/* Üst kısım */}
      <header className="px-5 sm:px-10 pt-36 sm:pt-44 pb-14 sm:pb-20">
        <div className="mx-auto max-w-[1400px] grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }}>
            <p className="flex items-center gap-4 font-mono text-[11px] tracking-[0.4em] text-[#c9a96e]">
              <span aria-hidden="true" className="h-px w-10 bg-[#c9a96e]" />
              İLETİŞİM
            </p>
            <h1 className="mt-5 font-serif font-normal leading-[1.05] text-[clamp(2.4rem,4.4vw,4.2rem)]">
              Showroom <span className="italic text-[#e2cc9b]">&amp; Danışmanlık</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.2 }}
            className="max-w-md text-[15px] sm:text-base leading-relaxed text-[#f1ece2]/60 lg:pb-2"
          >
            Vadistanbul'daki lounge'umuzda koleksiyonu kahve eşliğinde, size ayrılmış bir saatte inceleyin. Portföy
            yöneticiniz test sürüşünden finansmana kadar her adımda yanınızda.
          </motion.p>
        </div>
      </header>

      {/* İki kolon: lounge görseli + harita */}
      <section className="px-5 sm:px-10">
        <div className="mx-auto max-w-[1400px] grid gap-4 lg:grid-cols-2">
          <motion.figure
            initial={{ opacity: 0, clipPath: 'inset(10% 0 0 0)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.3, ease }}
            className="relative aspect-[4/3] lg:aspect-auto lg:h-[560px] overflow-hidden"
          >
            <img
              src="/experience/showroom-lounge.jpg"
              alt="Vanguard Automotive Vadistanbul showroom lounge"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '55% 50%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <figcaption className="absolute left-5 bottom-5 font-mono text-[10px] tracking-[0.3em] text-white/75">
              VANGUARD LOUNGE · VADİSTANBUL
            </figcaption>
          </motion.figure>

          <motion.div {...fadeUp(0.15)} className="flex flex-col">
            <div className="relative flex-1 min-h-[360px] lg:min-h-0 overflow-hidden bg-[#0f1113]">
              {/* Koyu/monokrom görünüm için harita filtreyle karartılır */}
              <iframe
                title="Vanguard Automotive showroom konumu"
                src={SHOWROOM.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.95)]"
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                <span className="whitespace-nowrap bg-[#16181b] border border-[#c9a96e]/60 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-[#e2cc9b]">
                  VANGUARD · VADİSTANBUL
                </span>
                <span className="h-5 w-px bg-[#c9a96e]" />
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9a96e]/60" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-[#c9a96e]" />
                </span>
              </div>
            </div>
            <a
              href={SHOWROOM.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border-x border-b border-[#f1ece2]/10 px-5 py-4 font-mono text-[11px] tracking-[0.3em] hover:bg-[#f1ece2]/[0.04] transition-colors"
            >
              GOOGLE MAPS'TE AÇ
              <ArrowUpRight className="w-4 h-4 text-[#c9a96e] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Bilgi kartları */}
      <section className="px-5 sm:px-10 pt-16 sm:pt-24">
        <div className="mx-auto max-w-[1400px] grid gap-px bg-[#f1ece2]/10 border border-[#f1ece2]/10 md:grid-cols-3">
          <motion.div {...fadeUp(0)} className="bg-[#16181b] p-7 sm:p-10">
            <p className={label}>
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> ADRES
            </p>
            <p className="mt-4 font-serif text-[22px] leading-snug">{SHOWROOM.area}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#f1ece2]/65">
              {SHOWROOM.address}
              <br />
              {SHOWROOM.postal}
            </p>
            <p className={`${label} mt-8`}>
              <CarIcon className="w-3.5 h-3.5" strokeWidth={1.5} /> OTOPARK & VALE
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#f1ece2]/65">{SHOWROOM.parking}</p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="bg-[#16181b] p-7 sm:p-10">
            <p className={label}>
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> ÇALIŞMA SAATLERİ
            </p>
            <dl className="mt-4 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#f1ece2]/10 pb-3">
                <dt className="text-sm text-[#f1ece2]/65">Pazartesi – Cumartesi</dt>
                <dd className="whitespace-nowrap font-serif text-lg [font-variant-numeric:lining-nums]">10:00 – 19:00</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="text-sm text-[#f1ece2]/65">Pazar</dt>
                <dd className="font-serif text-lg italic text-[#e2cc9b]">Yalnızca randevu ile</dd>
              </div>
            </dl>
            <p className="mt-8 text-sm leading-relaxed text-[#f1ece2]/50">
              Mesai dışı özel sunumlar için portföy yöneticinizle randevu oluşturabilirsiniz.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="bg-[#16181b] p-7 sm:p-10 flex flex-col">
            <p className={label}>
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} /> VIP HAT
            </p>
            <a
              href={PHONE.href}
              className="mt-4 font-serif text-[28px] [font-variant-numeric:lining-nums] hover:text-[#e2cc9b] transition-colors"
            >
              {PHONE.display}
            </a>
            <div className="mt-6 grid gap-2">
              <a
                href={PHONE.href}
                className="flex items-center justify-center gap-2.5 bg-[#c9a96e] hover:bg-[#e2cc9b] py-3.5 font-mono text-[11px] tracking-[0.2em] text-[#1c1e22] transition-colors"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} /> HEMEN ARAYIN
              </a>
              <a
                href={whatsappLink('Merhaba, Vanguard Automotive showroom ziyareti hakkında bilgi almak istiyorum.')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 border border-[#f1ece2]/25 hover:border-[#c9a96e] hover:text-[#e2cc9b] py-3.5 font-mono text-[11px] tracking-[0.2em] transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} /> WHATSAPP
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center justify-center gap-2.5 border border-[#f1ece2]/25 hover:border-[#c9a96e] hover:text-[#e2cc9b] py-3.5 font-mono text-[11px] tracking-[0.2em] transition-colors"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} /> E-POSTA
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Randevu çağrısı */}
      <section className="px-5 sm:px-10 py-20 sm:py-28">
        <motion.div {...fadeUp(0)} className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] leading-tight">
            Kahveniz hazır olsun,
            <br />
            <span className="italic text-[#e2cc9b]">aracınız da.</span>
          </p>
          <button
            type="button"
            onClick={() => openReserve(null, 'showroom')}
            className="group mt-10 inline-flex items-center gap-3 sm:gap-4 whitespace-nowrap bg-[#c9a96e] hover:bg-[#e2cc9b] max-w-full px-5 sm:px-12 py-5 font-mono text-[10px] sm:text-xs tracking-[0.1em] min-[380px]:tracking-[0.15em] sm:tracking-[0.25em] text-[#1c1e22] transition-colors"
          >
            SHOWROOM ZİYARETİ RANDEVUSU AL
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </section>
    </main>
  );
};
