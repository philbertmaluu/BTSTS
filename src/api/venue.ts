import { get, post, put, del } from './baseApi';
import { Venue } from '../types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getVenues = async (): Promise<Venue[]> => {
  const response: ApiResponse<Venue[]> = await get('/venues');
  return response.data;
};

export const createVenue = async (venueData: Omit<Venue, 'id' | 'created_at' | 'updated_at'>): Promise<Venue> => {
  const response: ApiResponse<Venue> = await post('/venues', venueData);
  return response.data;
};

export const getVenue = async (id: number): Promise<Venue> => {
  const response: ApiResponse<Venue> = await get(`/venues/${id}`);
  return response.data;
};

export const updateVenue = async (id: number, venueData: Partial<Omit<Venue, 'id' | 'created_at' | 'updated_at'>>): Promise<Venue> => {
  const response: ApiResponse<Venue> = await put(`/venues/${id}`, venueData);
  return response.data;
};

export const deleteVenue = async (id: number): Promise<void> => {
  await del(`/venues/${id}`);
};