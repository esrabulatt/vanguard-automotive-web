// Ana sayfa videosundaki araçların API id'leri (fiyat ve "Özel Sunum" bağlantısı için)
export const HERO_CAR_IDS = { gClass: 'car-2', defender: 'car-1' } as const;

// Ana sayfa videosu: sayfa açılınca sessiz başlar ve sürekli döner.
// Kaynak: Desktop/vehicler-mrc-dfn.mp4 — sessiz, web için sıkıştırılmış kopyaları kullanılır.
export const HERO_VIDEO = {
  src: '/hero/suv-1080.mp4',
  /** Küçük ekranlarda daha hafif sürüm yüklenir */
  srcMobile: '/hero/suv-720.mp4',
  poster: '/hero/suv-poster.jpg',
};

export const HERO_CONTENT = {
  label: '01 — ZİRVE',
  title: 'Zirveye birlikte.',
  carIds: [HERO_CAR_IDS.gClass, HERO_CAR_IDS.defender],
};
