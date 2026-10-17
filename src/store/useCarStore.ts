import { create } from 'zustand';
import type { AppointmentType, Category } from '../types/car';

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
  /** Tüm araçlar sayfası (hamburger menüden açılır) */
  fleetOpen: boolean;
  openFleet: (category?: Category | 'All', search?: string) => void;
  closeFleet: () => void;
}

export const useCarStore = create<CarState>()((set) => ({
  searchQuery: '',
  selectedCategory: 'All',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  reserveOpen: false,
  reserveCarId: null,
  reserveType: 'showroom',
  openReserve: (carId = null, type = 'showroom') => set({ reserveOpen: true, reserveCarId: carId, reserveType: type }),
  closeReserve: () => set({ reserveOpen: false }),
  detailCarId: null,
  openDetail: (carId) => set({ detailCarId: carId }),
  closeDetail: () => set({ detailCarId: null }),
  fleetOpen: false,
  openFleet: (category = 'All', search = '') => set({ fleetOpen: true, selectedCategory: category, searchQuery: search }),
  closeFleet: () => set({ fleetOpen: false }),
}));
