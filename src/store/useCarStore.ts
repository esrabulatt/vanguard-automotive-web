import { create } from 'zustand';
import type { AppointmentType, Category } from '../types/car';

/**
 * Katmanlar (katalog, araç detayı, randevu, menü) adres çubuğuna bağlıdır:
 *   ?koleksiyon=tum|arazi|luks & ara=… & arac=car-1 & randevu=genel|car-1 & tur=adres & menu=1
 * Böylece tarayıcının geri tuşu her seferinde bir katmanı kapatır ve linkler paylaşılabilir.
 * Store'daki durum adres çubuğundan okunur (App → syncFromUrl); eylemler adresi değiştirir.
 */

export type UrlPatch = Record<string, string | null>;
export interface OverlayNavigator {
  open: (patch: UrlPatch, opts?: { replace?: boolean }) => void;
  close: (keys: string[]) => void;
}

let nav: OverlayNavigator | null = null;
/** App, router'a bağlı gezinme fonksiyonlarını buradan kaydeder */
export const registerOverlayNavigator = (n: OverlayNavigator) => {
  nav = n;
};

export const CATEGORY_SLUGS: Record<Category | 'All', string> = { All: 'tum', 'Off-Road': 'arazi', Luxury: 'luks' };
const slugToCategory = (slug: string | null): Category | 'All' =>
  (Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug)?.[0] as Category | 'All') ?? 'All';

interface CarState {
  searchQuery: string;
  selectedCategory: Category | 'All';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | 'All') => void;
  /** Özel sunum randevu modalı: açık mı, hangi araç için (yoksa genel randevu) ve başlangıç sekmesi */
  reserveOpen: boolean;
  reserveCarId: string | null;
  reserveType: AppointmentType;
  openReserve: (carId?: string | null, type?: AppointmentType) => void;
  closeReserve: () => void;
  /** Detay ekranı açık olan aracın id'si */
  detailCarId: string | null;
  openDetail: (carId: string) => void;
  closeDetail: () => void;
  /** Katalog sayfası */
  fleetOpen: boolean;
  openFleet: (category?: Category | 'All', search?: string) => void;
  closeFleet: () => void;
  /** Tam ekran menü */
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  /** Adres çubuğundaki parametrelerden durumu günceller */
  syncFromUrl: (params: URLSearchParams) => void;
}

export const useCarStore = create<CarState>()((set) => ({
  searchQuery: '',
  selectedCategory: 'All',
  setSearchQuery: (query) => nav?.open({ ara: query || null }, { replace: true }),
  setSelectedCategory: (category) => nav?.open({ koleksiyon: CATEGORY_SLUGS[category] }, { replace: true }),
  reserveOpen: false,
  reserveCarId: null,
  reserveType: 'showroom',
  openReserve: (carId = null, type = 'showroom') =>
    nav?.open({ randevu: carId ?? 'genel', tur: type === 'home' ? 'adres' : null }),
  closeReserve: () => nav?.close(['randevu', 'tur']),
  detailCarId: null,
  openDetail: (carId) => nav?.open({ arac: carId }),
  closeDetail: () => nav?.close(['arac']),
  fleetOpen: false,
  openFleet: (category = 'All', search = '') =>
    nav?.open({ koleksiyon: CATEGORY_SLUGS[category], ara: search || null, arac: null }),
  closeFleet: () => nav?.close(['koleksiyon', 'ara', 'arac']),
  menuOpen: false,
  openMenu: () => nav?.open({ menu: '1' }),
  closeMenu: () => nav?.close(['menu']),
  syncFromUrl: (params) => {
    const randevu = params.get('randevu');
    set({
      fleetOpen: params.has('koleksiyon'),
      selectedCategory: slugToCategory(params.get('koleksiyon')),
      searchQuery: params.get('ara') ?? '',
      detailCarId: params.get('arac'),
      reserveOpen: Boolean(randevu),
      // Kapanış animasyonu bitene kadar son seçili araç korunur
      ...(randevu ? { reserveCarId: randevu === 'genel' ? null : randevu } : {}),
      reserveType: params.get('tur') === 'adres' ? 'home' : 'showroom',
      menuOpen: params.get('menu') === '1',
    });
  },
}));
