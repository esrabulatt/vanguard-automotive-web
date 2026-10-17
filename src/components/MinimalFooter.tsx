import React, { useState } from 'react';
import { Logo } from './Logo';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { EMAIL, PHONE } from '../constants/contact';
import { Link } from 'react-router-dom';
import { useCarStore } from '../store/useCarStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACTS = [
  { href: PHONE.href, label: PHONE.display, Icon: Phone },
  { href: `mailto:${EMAIL}`, label: EMAIL, Icon: Mail },
  { href: 'https://maps.google.com/?q=İstanbul', label: 'Konum', Icon: MapPin },
];

// Vitrinin hemen altına bağlanan sade, tam genişlik koyu footer:
// solda slogan + bülten, ortada tüm filoya yönlendirme, sağda iletişim
export const MinimalFooter: React.FC = () => {
  const openFleet = useCarStore((state) => state.openFleet);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle');

  // Bülten için backend yok; şimdilik sadece adres doğrulanır ve teşekkür mesajı gösterilir
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(EMAIL_REGEX.test(email.trim()) ? 'done' : 'error');
  };

  return (
    <footer id="iletisim" className="bg-[#1c1e22] text-white">
      <div className="mx-auto max-w-[1720px] px-6 sm:px-12 pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_auto_1fr] lg:items-end">
          {/* Sol: slogan ve bülten */}
          <div>
            <p className="font-serif text-4xl sm:text-5xl leading-[1.1] text-white">
              Yolun bittiği yerde
              <br />
              <span className="italic text-white/60">yolculuk başlar.</span>
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55">
              Yeni gelen araçlardan ve özel tekliflerden ilk siz haberdar olun.
            </p>

            {status === 'done' ? (
              <p className="mt-6 font-mono text-xs tracking-wider text-accent">TEŞEKKÜRLER — LİSTEMİZE EKLENDİNİZ.</p>
            ) : (
              <form onSubmit={subscribe} noValidate className="mt-6 flex max-w-md border-b border-white/25 focus-within:border-white">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus('idle');
                  }}
                  placeholder="E-posta adresiniz"
                  aria-label="E-posta adresiniz"
                  className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button type="submit" className="flex items-center gap-2 py-3 pl-4 font-mono text-xs tracking-[0.2em] text-white/80 hover:text-white">
                  ABONE OL <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
            {status === 'error' && <p className="mt-2 text-sm text-red-400">Geçerli bir e-posta adresi girin.</p>}
          </div>

          {/* Orta: tüm filo */}
          <div className="lg:justify-self-center">
            <button
              type="button"
              onClick={() => openFleet('All')}
              className="group flex items-center gap-4 whitespace-nowrap border border-white/30 hover:border-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-5 font-mono text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.25em] transition-colors"
            >
              TÜM FİLOYU GÖRÜNTÜLE
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Sağ: iletişim */}
          <div className="lg:justify-self-end">
            <p className="font-mono text-[11px] tracking-[0.3em] text-white/45 lg:text-right">HEMEN ARAYIN</p>
            <a href={PHONE.href} className="mt-2 block font-serif text-3xl sm:text-4xl text-white hover:text-[#e2cc9b] transition-colors lg:text-right [font-variant-numeric:lining-nums]">
              {PHONE.display}
            </a>
            <div className="mt-4 flex gap-2">
              {CONTACTS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={label}
                  title={label}
                  className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:bg-white hover:text-gray-900 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
          <Logo size="lg" className="text-white" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.3em] text-white/40">
            <Link to="/iletisim" className="inline-block py-3 text-white/70 hover:text-[#e2cc9b]">
              İLETİŞİM &amp; SHOWROOM →
            </Link>
            <span>© 2026 VANGUARD AUTOMOTIVE · LÜKS BUTİK GALERİ</span>
          </div>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-white/35">
          Bu site bir portfolyo / demo projesidir. Vanguard Automotive gerçek bir işletme değildir; araçlar, fiyatlar,
          adres ve iletişim bilgileri örnek amaçlıdır. Formlardan gönderilen talepler gerçek bir satış ekibine iletilmez.
        </p>
      </div>
    </footer>
  );
};
