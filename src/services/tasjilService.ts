import { api } from './api';
import type { Tasjil, ApiResponse } from '../types';

export const tasjilService = {
  async getAll(): Promise<ApiResponse<{ recordings: Tasjil[]; count: number }>> {
    const response = await api.get('/tasjil');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<{ recording: Tasjil }>> {
    const response = await api.get(`/tasjil/${id}`);
    return response.data;
  },

  async upload(formData: FormData): Promise<ApiResponse<{ recording: Tasjil }>> {
    const response = await api.post('/tasjil', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/tasjil/${id}`);
    return response.data;
  },

  getStreamUrl(id: string): string {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tasjil/${id}/stream`;
  },
};
