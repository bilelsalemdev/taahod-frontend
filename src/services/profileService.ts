import { api } from './api';
import type { ApiResponse } from '../types';
import type { User } from '../types/auth';

export interface ProfileData {
  user: User;
  stats: {
    totalBooksRead: number;
    totalProgress: number;
    activeCollaborations: number;
    tasjilCount: number;
  };
}

export const profileService = {
  async get(): Promise<ApiResponse<ProfileData>> {
    const response = await api.get('/profile');
    return response.data;
  },

  async update(data: {
    name?: string;
    email?: string;
    language?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put('/profile', data);
    return response.data;
  },
};
