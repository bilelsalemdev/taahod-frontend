import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../services';
import type { Schedule } from '../types';

// Query keys
export const scheduleKeys = {
  all: ['schedule'] as const,
  list: () => [...scheduleKeys.all, 'list'] as const,
};

// Get user schedule
export function useSchedule() {
  return useQuery({
    queryKey: scheduleKeys.list(),
    queryFn: () => scheduleService.get(),
  });
}

// Generate schedule mutation
export function useGenerateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      subjectIds: string[];
      dailyStudyHours?: number;
      preferredStartTime?: string;
      daysPerWeek?: number[];
      replaceExisting?: boolean;
    }) => scheduleService.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
}

// Update schedule entry mutation
export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Schedule> }) =>
      scheduleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
}

// Delete schedule entry mutation
export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.list() });
    },
  });
}
