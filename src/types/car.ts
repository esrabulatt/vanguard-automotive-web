export type Category = 'Off-Road' | 'Luxury';

export interface Specs {
    seats: number;
    transmission: string;
    fuelType: string;
    acceleration: string;
    rangeOrHorsepower: string;

};

export interface StoryBlock {
    title: string;
    text: string;
}

export interface CarVideo {
    src: string;
    srcMobile?: string;
    poster?: string;
}

export interface Car {
    id: string;
    name: string;
    brand: string;
    category: Category;
    pricePerDay: number;
    /** Satış fiyatı (TL) */
    price: number;
    /** Model yılı */
    year: number;
    image: string;
    gallery: string[];
    specs: Specs;
    features: string[];
    /** Detay sayfası: her görselin altındaki açıklama (gallery ile aynı sırada) */
    story?: StoryBlock[];
    /** Detay sayfası açılışında görsel yerine oynatılan video */
    video?: CarVideo;
    /** Ekspertiz raporu (PDF) adresi; yoksa sitede rapor e-postayla talep edilir */
    reportUrl?: string;
    isFeatured: boolean;
    isAvailable: boolean;
};

export type AppointmentType = 'showroom' | 'home';
export type TimeSlot = 'morning' | 'noon' | 'afternoon';
export type Region = 'istanbul-europe' | 'istanbul-asia' | 'bodrum' | 'ankara';

export interface AppointmentPayload {
    /** Genel (navbar'dan açılan) randevuda boş olabilir */
    carId?: string;
    customerName: string;
    phone: string;
    type: AppointmentType;
    /** YYYY-MM-DD */
    date: string;
    timeSlot: TimeSlot;
    /** Sadece "home" (adreste sunum) için: sunum bölgesi ve adres / semt */
    region?: Region;
    address?: string;
}

export interface AppointmentResponse extends AppointmentPayload {
    id: string;
    status: 'pending';
    createdAt: string;
}

export type ApiSuccess<T> = { success: true; data: T; count?: number };
export type ApiError = { success: false; message: string; errors?: string[] };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;