import axios from 'axios';
import type { ApiResponse, AppointmentPayload, AppointmentResponse, Car, Category } from '../types/car';

// Backend: ~/rent-a-car-api (varsayılan port 3001)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
  // 4xx cevaplarında da gövdeyi okuyup backend'in mesajını göstermek için
  validateStatus: (status) => status < 500,
});

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.errors?.join(' ') || response.message);
  }
  return response.data;
};

export interface CarFilters {
  category?: Category;
  brand?: string;
  search?: string;
}

export const getCars = async (filters: CarFilters = {}): Promise<Car[]> => {
  const { data } = await api.get<ApiResponse<Car[]>>('/cars', { params: filters });
  return unwrap(data);
};

export const createAppointment = async (payload: AppointmentPayload): Promise<AppointmentResponse> => {
  const { data } = await api.post<ApiResponse<AppointmentResponse>>('/appointments', payload);
  return unwrap(data);
};
