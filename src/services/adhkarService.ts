import { api } from './api';
import type { Adhkar, ApiResponse } from '../types';

export const adhkarService = {
  async getAll(): Promise<ApiResponse<{ adhkar: Adhkar[]; count: number }>> {
    const response = await api.get('/adhkar');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<{ adhkar: Adhkar }>> {
    const response = await api.get(`/adhkar/${id}`);
    return response.data;
  },

  async getByCategory(category: string): Promise<ApiResponse<{ adhkar: Adhkar[]; count: number }>> {
    const response = await api.get(`/adhkar/category/${category}`);
    return response.data;
  },

  async create(data: Partial<Adhkar>): Promise<ApiResponse<{ adhkar: Adhkar }>> {
    const response = await api.post('/adhkar', data);
    return response.data;
  },

  async update(id: string, data: Partial<Adhkar>): Promise<ApiResponse<{ adhkar: Adhkar }>> {
    const response = await api.put(`/adhkar/${id}`, data);
    return response.data;
  },
};
