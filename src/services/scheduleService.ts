import { api } from './api';
import { Schedule, ApiResponse } from '../types';

export const scheduleService = {
  async get(): Promise<
    ApiResponse<{
      schedule: Schedule[];
      scheduleByDay: { [key: number]: Schedule[] };
      count: number;
    }>
  > {
    const response = await api.get('/schedule');
    return response.data;
  },

  async generate(data: {
    subjectIds: string[];
    dailyStudyHours?: number;
    preferredStartTime?: string;
    daysPerWeek?: number[];
    replaceExisting?: boolean;
  }): Promise<ApiResponse<{ schedule: Schedule[]; count: number }>> {
    const response = await api.post('/schedule/generate', data);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<Schedule>
  ): Promise<ApiResponse<{ schedule: Schedule }>> {
    const response = await api.put(`/schedule/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/schedule/${id}`);
    return response.data;
  },
};
