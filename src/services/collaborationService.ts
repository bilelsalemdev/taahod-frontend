import { api } from './api';
import { Collaboration, ApiResponse, Progress } from '../types';

export const collaborationService = {
  async getAll(): Promise<ApiResponse<{ collaborations: Collaboration[]; count: number }>> {
    const response = await api.get('/collaborations');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<{ collaboration: Collaboration }>> {
    const response = await api.get(`/collaborations/${id}`);
    return response.data;
  },

  async create(data: {
    name: string;
    bookId: string;
    targetCompletionDate?: string;
  }): Promise<ApiResponse<{ collaboration: Collaboration }>> {
    const response = await api.post('/collaborations', data);
    return response.data;
  },

  async join(id: string): Promise<ApiResponse<{ collaboration: Collaboration }>> {
    const response = await api.post(`/collaborations/${id}/join`);
    return response.data;
  },

  async leave(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/collaborations/${id}/leave`);
    return response.data;
  },

  async getProgress(id: string): Promise<
    ApiResponse<{
      collaboration: Collaboration;
      participantProgress: Array<{
        user: {
          _id: string;
          name: string;
          email: string;
        };
        progress: Progress | null;
      }>;
    }>
  > {
    const response = await api.get(`/collaborations/${id}/progress`);
    return response.data;
  },
};
