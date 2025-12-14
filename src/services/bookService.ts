import { api } from './api';
import { ChunkDownloadService } from './chunkDownloadService';
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
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Include token in URL for PDF.js to work with authentication
    return `${baseUrl}/books/${id}/file?token=${token}`;
  },

  async downloadFile(id: string, onProgress?: (progress: number) => void): Promise<Blob> {
    const response = await api.get(`/books/${id}/file`, {
      responseType: 'blob',
      timeout: 300000, // 5 minutes for large files
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Download progress: ${percentCompleted}%`);
          onProgress?.(percentCompleted);
        }
      },
    });
    return response.data;
  },

  async getFileBlob(id: string, onProgress?: (progress: number) => void): Promise<string> {
    const blob = await this.downloadFile(id, onProgress);
    return URL.createObjectURL(blob);
  },

  /**
   * Download book file in chunks (for large files)
   */
  async downloadFileInChunks(id: string, filename: string, onProgress?: (progress: number) => void): Promise<void> {
    const url = this.getFileUrl(id);
    await ChunkDownloadService.downloadAndSave(url, filename, { onProgress });
  },
};
