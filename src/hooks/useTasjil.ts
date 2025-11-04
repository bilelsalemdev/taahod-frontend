import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasjilService } from '../services';

// Query keys
export const tasjilKeys = {
  all: ['tasjil'] as const,
  lists: () => [...tasjilKeys.all, 'list'] as const,
  list: () => [...tasjilKeys.lists()] as const,
  details: () => [...tasjilKeys.all, 'detail'] as const,
  detail: (id: string) => [...tasjilKeys.details(), id] as const,
};

// Get all recordings
export function useTasjil() {
  return useQuery({
    queryKey: tasjilKeys.list(),
    queryFn: () => tasjilService.getAll(),
  });
}

// Get single recording
export function useTasjilById(id: string) {
  return useQuery({
    queryKey: tasjilKeys.detail(id),
    queryFn: () => tasjilService.getById(id),
    enabled: !!id,
  });
}

// Upload recording mutation
export function useUploadTasjil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => tasjilService.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasjilKeys.lists() });
    },
  });
}

// Delete recording mutation
export function useDeleteTasjil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasjilService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasjilKeys.lists() });
    },
  });
}
