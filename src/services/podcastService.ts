import { api } from './api';
import type { Podcast, ApiResponse } from '../types';

export const podcastService = {
  async getAll(): Promise<ApiResponse<{ podcasts: Podcast[]; count: number }>> {
    const response = await api.get('/podcasts');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<{ podcast: Podcast }>> {
    const response = await api.get(`/podcasts/${id}`);
    return response.data;
  },

  async create(formData: FormData): Promise<ApiResponse<{ podcast: Podcast }>> {
    const response = await api.post('/podcasts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: string, data: Partial<Podcast>): Promise<ApiResponse<{ podcast: Podcast }>> {
    const response = await api.put(`/podcasts/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/podcasts/${id}`);
    return response.data;
  },

  getStreamUrl(id: string): string {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/podcasts/${id}/stream`;
  },
};
