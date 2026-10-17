// Ana sayfa videosunun altındaki, kaydırdıkça ilerleyen tam ekran video.
// Kaynak: Desktop/araç görseller/gmc yönler/Green_SUV_driving_on_mountain_20261017182134.mp4
// Her kare anahtar kare olacak şekilde kodlandı (ffmpeg -g 1); yoksa geri sarma takılır.
export const SCROLL_VIDEO = {
  src: '/hero/gmc-scroll.mp4',
  poster: '/hero/gmc-scroll-poster.jpg',
  /** Kaydırma uzunluğu (ekran yüksekliği cinsinden); büyüdükçe video daha yavaş akar */
  scrollLength: 420,
  /** Videodaki aracın API id'si (GMC Trail AT4); fiyat ve "Özel Sunum" bağlantısı için */
  carId: 'car-5',
};

/** Videonun belirli saniyeleri arasında görünen başlıklar */
export const SCROLL_VIDEO_CAPTIONS = [
  { start: 0, end: 3.4, label: 'YAKLAŞIYOR', title: 'Her viraj bir davet.' },
  { start: 3.4, end: 5.6, label: 'YANINIZDA', title: 'Toprak, taş, tırmanış.' },
  { start: 5.6, end: 10, label: 'UFKA DOĞRU', title: 'Yol sizi bekliyor.' },
];
