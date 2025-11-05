import { api } from './api';
import type { Book, ApiResponse, PaginatedResponse, PaginationParams } from '../types';

export const bookService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Book>> {
    const response = await api.get('/books', { params });
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<{ book: Book }>> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async create(formData: FormData): Promise<ApiResponse<{ book: Book }>> {
    const response = await api.post('/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(id: string, data: Partial<Book>): Promise<ApiResponse<{ book: Book }>> {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  getFileUrl(id: string): string {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/books/${id}/file`;
  },
};
