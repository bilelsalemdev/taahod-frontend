import { api } from './api';
import type { Progress, ApiResponse } from '../types';

export const progressService = {
  async getAll(): Promise<ApiResponse<{ progress: Progress[]; count: number }>> {
    const response = await api.get('/progress');
    return response.data;
  },

  async getByBook(bookId: string): Promise<ApiResponse<{ progress: Progress }>> {
    const response = await api.get(`/progress/book/${bookId}`);
    return response.data;
  },

  async save(data: {
    bookId: string;
    currentPage: number;
    totalPages?: number;
    notes?: string;
  }): Promise<ApiResponse<{ progress: Progress }>> {
    const response = await api.post('/progress', data);
    return response.data;
  },

  async getStats(): Promise<
    ApiResponse<{
      stats: {
        totalBooks: number;
        completedBooks: number;
        inProgressBooks: number;
        notStartedBooks: number;
        averageProgress: number;
      };
      recentlyRead: Progress[];
    }>
  > {
    const response = await api.get('/progress/stats');
    return response.data;
  },
};
