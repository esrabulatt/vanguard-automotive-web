import type { Category } from '../types/car';

// API'deki kategori adları ve sitede görünen Türkçe karşılıkları
export const CATEGORY_LABELS: Record<Category, string> = {
  'Off-Road': 'Arazi',
  Luxury: 'Lüks',
};

/** Filtre butonlarının sırası ("Tümü" dahil) */
export const CATEGORY_FILTERS: { value: Category | 'All'; label: string }[] = [
  { value: 'All', label: 'Tümü' },
  ...(Object.keys(CATEGORY_LABELS) as Category[]).map((value) => ({ value, label: CATEGORY_LABELS[value] })),
];
