import { CATEGORY_LABELS } from '../constants/categories';
import type { Car } from '../types/car';

// Türkçe karakterleri sadeleştirir: "Lüks" → "luks", "ARAZİ" → "arazi"
const normalize = (value: string) =>
  value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9\s]/g, ' ');

/** Aranacak metin: marka, model, kategori (TR + EN), yıl ve yakıt */
const haystack = (car: Car) =>
  normalize(
    [car.brand, car.name, CATEGORY_LABELS[car.category], car.category, car.year, car.specs.fuelType, car.specs.transmission].join(' '),
  );

/** Aramadaki her kelime aracın bilgilerinde geçiyorsa eşleşir ("mercedes g", "arazi toyota", "2024") */
export const matchesSearch = (car: Car, query: string) => {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = haystack(car);
  return words.every((word) => text.includes(word));
};
