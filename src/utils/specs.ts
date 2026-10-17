import type { Car } from '../types/car';

// API'deki teknik değerler İngilizce gelir; sitede tutarlı Türkçe gösterilir.
const FUEL: Record<string, string> = { Petrol: 'Benzin', Diesel: 'Dizel', Electric: 'Elektrik', Hybrid: 'Hibrit' };
const GEAR: Record<string, string> = { Automatic: 'Otomatik', Manual: 'Manuel' };

const decimal = (value: string) => value.replace('.', ',');

export const fuelTr = (car: Car) => FUEL[car.specs.fuelType] ?? car.specs.fuelType;
export const gearTr = (car: Car) => GEAR[car.specs.transmission] ?? car.specs.transmission;

/** "0-100 km/h in 6.1s" → "6,1 sn" */
export const accelerationTr = (car: Car) => {
  const match = car.specs.acceleration.match(/([\d.]+)\s*s/);
  return match ? `${decimal(match[1])} sn` : car.specs.acceleration;
};

/** "400 hp" → "400 HP", "600 km range" → "600 km menzil" */
export const powerTr = (car: Car) =>
  car.specs.rangeOrHorsepower.replace(/\s*hp$/i, ' HP').replace(/\s*km range$/i, ' km menzil');
