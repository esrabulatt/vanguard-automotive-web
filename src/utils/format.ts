export const formatPrice = (value: number) => `₺${value.toLocaleString('tr-TR')}`;

export const carTitle = (car: { brand: string; name: string }) =>
  car.name.startsWith(car.brand) ? car.name : `${car.brand} ${car.name}`;

/** Telefon numarasının rakamları; en fazla 11 hane (0532 123 45 67) */
export const phoneDigits = (value: string) => value.replace(/\D/g, '').slice(0, 11);

/** "05322344245" → "0532 234 42 45" (yazarken de kısmi biçimlendirir) */
export const formatPhone = (value: string) => {
  const d = phoneDigits(value);
  return [d.slice(0, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean).join(' ');
};
