import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { podcastService } from '../services';
import type { Podcast } from '../types';

// Query keys
export const podcastKeys = {
  all: ['podcasts'] as const,
  lists: () => [...podcastKeys.all, 'list'] as const,
  list: () => [...podcastKeys.lists()] as const,
  details: () => [...podcastKeys.all, 'detail'] as const,
  detail: (id: string) => [...podcastKeys.details(), id] as const,
};

// Get all podcasts
export function usePodcasts() {
  return useQuery({
    queryKey: podcastKeys.list(),
    queryFn: () => podcastService.getAll(),
  });
}

// Get single podcast
export function usePodcast(id: string) {
  return useQuery({
    queryKey: podcastKeys.detail(id),
    queryFn: () => podcastService.getById(id),
    enabled: !!id,
  });
}

// Create podcast mutation
export function useCreatePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => podcastService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: podcastKeys.lists() });
    },
  });
}

// Update podcast mutation
export function useUpdatePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Podcast> }) =>
      podcastService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: podcastKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: podcastKeys.lists() });
    },
  });
}

// Delete podcast mutation
export function useDeletePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => podcastService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: podcastKeys.lists() });
    },
  });
}
