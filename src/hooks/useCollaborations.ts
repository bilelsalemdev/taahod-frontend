import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collaborationService } from '../services';

// Query keys
export const collaborationKeys = {
  all: ['collaborations'] as const,
  lists: () => [...collaborationKeys.all, 'list'] as const,
  list: () => [...collaborationKeys.lists()] as const,
  details: () => [...collaborationKeys.all, 'detail'] as const,
  detail: (id: string) => [...collaborationKeys.details(), id] as const,
  progress: (id: string) => [...collaborationKeys.detail(id), 'progress'] as const,
};

// Get all collaborations
export function useCollaborations() {
  return useQuery({
    queryKey: collaborationKeys.list(),
    queryFn: () => collaborationService.getAll(),
  });
}

// Get single collaboration
export function useCollaboration(id: string) {
  return useQuery({
    queryKey: collaborationKeys.detail(id),
    queryFn: () => collaborationService.getById(id),
    enabled: !!id,
  });
}

// Get collaboration progress
export function useCollaborationProgress(id: string) {
  return useQuery({
    queryKey: collaborationKeys.progress(id),
    queryFn: () => collaborationService.getProgress(id),
    enabled: !!id,
  });
}

// Create collaboration mutation
export function useCreateCollaboration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      bookId: string;
      targetCompletionDate?: string;
    }) => collaborationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.lists() });
    },
  });
}

// Join collaboration mutation
export function useJoinCollaboration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collaborationService.join(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collaborationKeys.lists() });
    },
  });
}

// Leave collaboration mutation
export function useLeaveCollaboration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collaborationService.leave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collaborationKeys.lists() });
    },
  });
}
