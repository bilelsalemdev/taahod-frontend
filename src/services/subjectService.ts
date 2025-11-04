import { api } from './api';
import { Subject, ApiResponse } from '../types';

export const subjectService = {
  async getAll(): Promise<ApiResponse<{ subjects: Subject[]; count: number }>> {
    const response = await api.get('/subjects');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<{ subject: Subject }>> {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  async create(data: Partial<Subject>): Promise<ApiResponse<{ subject: Subject }>> {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  async update(id: string, data: Partial<Subject>): Promise<ApiResponse<{ subject: Subject }>> {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },

  async getBooks(id: string): Promise<ApiResponse<{ subject: any; books: any[]; count: number }>> {
    const response = await api.get(`/subjects/${id}/books`);
    return response.data;
  },
};
