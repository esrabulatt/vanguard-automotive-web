// Galeri iletişim bilgileri (şimdilik örnek; gerçek bilgilerle değiştirin)

/** Showroom sabit hattı (İstanbul Avrupa, 0212) */
export const PHONE = {
  display: '0212 555 00 00',
  href: 'tel:+902125550000',
};
export const EMAIL = 'info@vanguardautomotive.com';
export const WHATSAPP_NUMBER = '908501234567';

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const SHOWROOM = {
  area: 'Vadistanbul',
  district: 'Sarıyer, İstanbul',
  /** Açık adres (örnek; gerçek adresle değiştirin) */
  address: 'Ayazağa Mah. Cendere Cad. No: 109, Vadistanbul Bulvar',
  postal: '34485 Sarıyer / İstanbul',
  parking: 'Vadistanbul Bulvar kapalı otoparkı · Showroom girişinde ücretsiz vale hizmeti',
  hours: 'Pzt – Cts: 10:00 – 19:00',
  closed: 'Pazar: Yalnızca randevu ile',
  mapsUrl: 'https://maps.google.com/?q=Vadistanbul+Sar%C4%B1yer+%C4%B0stanbul',
  /** API anahtarı gerektirmeyen Google Haritalar gömme bağlantısı */
  mapsEmbed: 'https://maps.google.com/maps?q=Vadistanbul%20Sar%C4%B1yer%20%C4%B0stanbul&z=15&output=embed',
};
