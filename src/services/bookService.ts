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

  async downloadFile(id: string): Promise<Blob> {
    const response = await api.get(`/books/${id}/file`, {
      responseType: 'blob',
      timeout: 300000, // 5 minutes for large files
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Download progress: ${percentCompleted}%`);
        }
      },
    });
    return response.data;
  },

  async getFileBlob(id: string): Promise<string> {
    const blob = await this.downloadFile(id);
    return URL.createObjectURL(blob);
  },
};
