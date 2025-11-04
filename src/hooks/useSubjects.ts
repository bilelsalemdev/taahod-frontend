import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../services';
import type { Subject } from '../types';

// Query keys
export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: () => [...subjectKeys.lists()] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
  books: (id: string) => [...subjectKeys.detail(id), 'books'] as const,
};

// Get all subjects
export function useSubjects() {
  return useQuery({
    queryKey: subjectKeys.list(),
    queryFn: () => subjectService.getAll(),
  });
}

// Get single subject
export function useSubject(id: string) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectService.getById(id),
    enabled: !!id,
  });
}

// Get books in subject
export function useSubjectBooks(id: string) {
  return useQuery({
    queryKey: subjectKeys.books(id),
    queryFn: () => subjectService.getBooks(id),
    enabled: !!id,
  });
}

// Create subject mutation
export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Subject>) => subjectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}

// Update subject mutation
export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subject> }) =>
      subjectService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}

// Delete subject mutation
export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
