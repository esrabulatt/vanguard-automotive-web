import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Check, Home, Lock, X } from 'lucide-react';
import { PHONE } from '../constants/contact';
import { createAppointment } from '../services/api';
import { useCarStore } from '../store/useCarStore';
import { carTitle, formatPhone, formatPrice, phoneDigits } from '../utils/format';
import type { AppointmentResponse, AppointmentType, Car, Region, TimeSlot } from '../types/car';

const TYPES: { value: AppointmentType; label: string; short: string; note: string; Icon: typeof Home }[] = [
  { value: 'showroom', label: 'Showroom Ziyareti', short: 'Showroom', note: 'VIP İnceleme ve Kahve İkramı', Icon: Building2 },
  { value: 'home', label: 'Adresinizde Özel Sunum', short: 'Adresinizde', note: 'Kapalı Çekici ile Kapınıza Getirelim', Icon: Home },
];

const SLOTS: { value: TimeSlot; label: string; hours: string }[] = [
  { value: 'morning', label: 'Sabah', hours: '09:00 – 12:00' },
  { value: 'noon', label: 'Öğle', hours: '12:00 – 15:00' },
  { value: 'afternoon', label: 'Akşamüstü', hours: '15:00 – 19:00' },
];

// Adreste sunum yapılabilen bölgeler
const REGIONS: { value: Region; city: string; side?: string; example: string }[] = [
  { value: 'istanbul-europe', city: 'İstanbul', side: 'AVRUPA', example: 'Örn. Sarıyer, Tarabya' },
  { value: 'istanbul-asia', city: 'İstanbul', side: 'ANADOLU', example: 'Örn. Kadıköy, Moda' },
  { value: 'bodrum', city: 'Bodrum', example: 'Örn. Yalıkavak' },
  { value: 'ankara', city: 'Ankara', example: 'Örn. Çankaya, Ümitköy' },
];
const regionLabel = (value?: Region) => {
  const r = REGIONS.find((x) => x.value === value);
  return r ? (r.side ? `${r.city} (${r.side === 'AVRUPA' ? 'Avrupa' : 'Anadolu'})` : r.city) : '';
};
const slotLabel = (value: TimeSlot) => SLOTS.find((s) => s.value === value)?.label ?? '';

const MAX_DAYS_AHEAD = 60;
const ease = [0.2, 0.8, 0.2, 1] as const;
const isoDay = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const formatDay = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });

const inputClass =
  'w-full bg-transparent border-b border-[#f1ece2]/25 py-3 text-[15px] text-[#f1ece2] placeholder:text-[#f1ece2]/35 focus:outline-none focus:border-[#c9a96e] transition-colors';
const labelClass = 'font-mono text-[10px] tracking-[0.25em] text-[#f1ece2]/45';

// VIP özel sunum & showroom randevusu. Aracı rezerve etmez; danışman müşteriyi arayıp planlar.
// Bir araçtan açılırsa o araç seçili gelir; navbar'dan açılırsa genel randevudur (model isteğe bağlı).
// Dış bileşen açılış/kapanış animasyonunu yönetir; form durumu her açılışta iç bileşende sıfırlanır.
export const AppointmentModal: React.FC<{ cars: Car[] }> = ({ cars }) => {
  const { reserveOpen, reserveCarId, reserveType, closeReserve } = useCarStore();
  const car = cars.find((c) => c.id === reserveCarId);

  useEffect(() => {
    if (!reserveOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && closeReserve();
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [reserveOpen, closeReserve]);

  return (
    <AnimatePresence>
      {reserveOpen && (
        <motion.div
          key="appointment-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-6"
          onClick={closeReserve}
        >
          <AppointmentPanel key={reserveCarId ?? 'general'} car={car} cars={cars} initialType={reserveType} onClose={closeReserve} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface PanelProps {
  car?: Car;
  cars: Car[];
  initialType: AppointmentType;
  onClose: () => void;
}

const AppointmentPanel: React.FC<PanelProps> = ({ car, cars, initialType, onClose }) => {
  const [type, setType] = useState<AppointmentType>(initialType);
  // Genel randevuda müşteri isterse ilgilendiği modeli seçebilir
  const [modelId, setModelId] = useState('');
  const selected = car ?? cars.find((c) => c.id === modelId);
  const [form, setForm] = useState({ customerName: '', phone: '', address: '', date: isoDay(1) });
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning');
  const [region, setRegion] = useState<Region>('istanbul-europe');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AppointmentResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneDigits(form.phone).length !== 11) {
      setError('Telefon numarasını 11 haneli girin (örn. 0532 123 45 67).');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { address, ...rest } = form;
      setResult(
        await createAppointment({
          ...(selected ? { carId: selected.id } : {}),
          type,
          timeSlot,
          ...rest,
          phone: formatPhone(form.phone),
          ...(type === 'home' ? { region, address: address.trim() } : {}),
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Randevu oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeType = TYPES.find((t) => t.value === type)!;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reserve-title"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ duration: 0.55, ease }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full sm:max-w-xl max-h-[94vh] overflow-y-auto bg-[#1c1e22] text-[#f1ece2] shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-[#f1ece2]/60 hover:text-[#f1ece2]"
      >
        <X className="w-5 h-5" strokeWidth={1.25} />
      </button>

      {/* Başlık: seçili araç ya da genel randevu */}
      <div className="flex items-center gap-4 p-6 sm:p-8 pb-0 pr-14">
        {car ? (
          <>
            <img src={car.image} alt="" className="w-24 h-16 sm:w-28 sm:h-[72px] object-cover" />
            <div className="min-w-0">
              <h2 id="reserve-title" className="font-serif text-2xl sm:text-[28px] leading-tight [font-variant-numeric:lining-nums]">
                {carTitle(car)} <span className="text-[#f1ece2]/45">({car.year})</span>
              </h2>
              <p className="mt-1.5 font-mono text-[11px] tracking-[0.2em] text-[#c9a96e]">
                {formatPrice(car.price)} <span className="text-[#f1ece2]/35">/</span> VIP ÖZEL SUNUM
              </p>
            </div>
          </>
        ) : (
          <div>
            <p className="font-mono text-[10px] tracking-[0.35em] text-[#c9a96e]">VANGUARD AUTOMOTIVE</p>
            <h2 id="reserve-title" className="mt-2 font-serif text-3xl sm:text-4xl leading-tight">
              VIP Özel Sunum
              <br />
              <span className="italic text-[#f1ece2]/60">&amp; Showroom Randevusu</span>
            </h2>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="p-6 sm:p-8 text-center"
          >
            <span className="mx-auto mt-4 w-16 h-16 rounded-full border border-[#c9a96e] bg-[#c9a96e]/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-[#c9a96e]" strokeWidth={1.5} />
            </span>
            <p className="mt-6 font-serif text-3xl sm:text-4xl">Randevunuz Alındı.</p>
            <p className="mt-4 text-sm leading-relaxed text-[#e2cc9b]">
              {[
                result.type === 'home' ? 'Adresinizde Özel Sunum' : 'Showroom Ziyareti',
                result.type === 'home' && result.address ? `${regionLabel(result.region)} / ${result.address}` : null,
                formatDay(result.date),
                slotLabel(result.timeSlot),
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {selected && <p className="mt-1 text-sm text-[#f1ece2]/50">{carTitle(selected)}</p>}
            <p className="mt-4 text-sm leading-relaxed text-[#f1ece2]/65">
              Danışmanımız <strong className="text-[#f1ece2]">1 saat içinde</strong>{' '}
              <span className="whitespace-nowrap text-[#f1ece2]">{PHONE.display}</span> numaralı hattımızdan sizi
              arayacaktır.
              <br />
              <span className="text-[#f1ece2]/45">
                Aranacak numaranız: <span className="whitespace-nowrap">{formatPhone(result.phone)}</span>
              </span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 w-full border border-[#f1ece2]/30 hover:border-[#c9a96e] py-4 font-mono text-xs tracking-[0.25em] transition-colors"
            >
              TAMAM
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }} className="p-6 sm:p-8">
            {/* Sunum türü sekmeleri */}
            <div role="tablist" aria-label="Sunum türü" className="relative grid grid-cols-2 border border-[#f1ece2]/15 p-1">
              {TYPES.map(({ value, label, short, Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={type === value}
                  onClick={() => setType(value)}
                  className={`relative z-10 flex items-center justify-center gap-2 py-3 font-mono text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] transition-colors duration-300 ${
                    type === value ? 'text-[#1c1e22]' : 'text-[#f1ece2]/60 hover:text-[#f1ece2]'
                  }`}
                >
                  {type === value && (
                    <motion.span layoutId="appointment-tab" transition={{ duration: 0.45, ease }} className="absolute inset-0 -z-10 bg-[#e8dfcf]" />
                  )}
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span className="sm:hidden">{short.toLocaleUpperCase('tr-TR')}</span>
                  <span className="hidden sm:inline">{label.toLocaleUpperCase('tr-TR')}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={type}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="mt-3 font-serif italic text-[15px] text-[#e2cc9b]/80"
              >
                {activeType.note}
              </motion.p>
            </AnimatePresence>

            {/* Genel randevuda isteğe bağlı model seçimi */}
            {!car && (
              <label className="mt-6 block">
                <span className={labelClass}>İLGİLENDİĞİNİZ MODEL (İSTEĞE BAĞLI)</span>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className={`${inputClass} appearance-none cursor-pointer [color-scheme:dark]`}
                >
                
                  {cars
                    .filter((c) => c.isAvailable)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {carTitle(c)} · {formatPrice(c.price)}
                      </option>
                    ))}
                </select>
              </label>
            )}

            {/* Form alanları */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>AD SOYAD</span>
                <input
                  required
                  minLength={2}
                  autoComplete="name"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Adınız ve soyadınız"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>TELEFON</span>
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={14}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                  placeholder="0532 123 45 67"
                  className={inputClass}
                />
              </label>
              {/* Adreste sunum seçilince sunum bölgesi ve adres sorulur */}
              <AnimatePresence initial={false}>
                {type === 'home' && (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="sm:col-span-2 overflow-hidden"
                  >
                    <fieldset>
                      <legend className={labelClass}>SUNUM BÖLGESİ</legend>
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {REGIONS.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            aria-pressed={region === r.value}
                            onClick={() => setRegion(r.value)}
                            className={`border px-2 py-3 text-center transition-colors duration-300 ${
                              region === r.value
                                ? 'border-[#c9a96e] bg-[#c9a96e]/10 text-[#f1ece2]'
                                : 'border-[#f1ece2]/15 text-[#f1ece2]/60 hover:border-[#f1ece2]/40'
                            }`}
                          >
                            <span className="block text-sm">{r.city}</span>
                            <span className="block mt-0.5 font-mono text-[10px] tracking-wider opacity-60">{r.side ?? '\u00a0'}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <label className="block mt-4">
                      <span className={labelClass}>DETAYLI ADRES / SEMT</span>
                      <input
                        required
                        minLength={3}
                        autoComplete="street-address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder={REGIONS.find((r) => r.value === region)?.example}
                        className={inputClass}
                      />
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
              <label className="block sm:col-span-2">
                <span className={labelClass}>TERCİH EDİLEN GÜN</span>
                <input
                  required
                  type="date"
                  min={isoDay(0)}
                  max={isoDay(MAX_DAYS_AHEAD)}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className={labelClass}>ZAMAN DİLİMİ</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {SLOTS.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    aria-pressed={timeSlot === slot.value}
                    onClick={() => setTimeSlot(slot.value)}
                    className={`border px-2 py-3 text-center transition-colors duration-300 ${
                      timeSlot === slot.value
                        ? 'border-[#c9a96e] bg-[#c9a96e]/10 text-[#f1ece2]'
                        : 'border-[#f1ece2]/15 text-[#f1ece2]/60 hover:border-[#f1ece2]/40'
                    }`}
                  >
                    <span className="block text-sm">{slot.label}</span>
                    <span className="block mt-0.5 font-mono text-[10px] tracking-wider opacity-60">{slot.hours}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {error && <p className="mt-5 text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full bg-[#c9a96e] hover:bg-[#e2cc9b] disabled:opacity-60 text-[#1c1e22] py-4 font-mono text-[11px] sm:text-xs tracking-[0.18em] sm:tracking-[0.25em] transition-colors"
            >
              {submitting ? 'GÖNDERİLİYOR...' : 'ÖZEL SUNUM RANDEVUSUNU ONAYLA →'}
            </button>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-[#f1ece2]/45">
              <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.5} />
              Talebiniz gizlilik esasıyla işleme alınır. Portföy yöneticiniz randevu saatinizi teyit etmek için 1 saat içinde
              sizinle iletişime geçecektir.
            </p>
            <p className="mt-3 text-center font-mono text-[10px] tracking-[0.25em] text-[#f1ece2]/45">
              BEKLEMEK İSTEMİYOR MUSUNUZ?{' '}
              <a href={PHONE.href} className="inline-block py-2 whitespace-nowrap text-[#e2cc9b] hover:text-[#f1ece2]">
                HEMEN ARAYIN · {PHONE.display}
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
