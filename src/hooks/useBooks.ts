import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services';
import type { Book, PaginationParams } from '../types';

// Query keys
export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...bookKeys.lists(), params] as const,
  details: () => [...bookKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
};

// Get all books
export function useBooks(params?: PaginationParams) {
  return useQuery({
    queryKey: bookKeys.list(params),
    queryFn: () => bookService.getAll(params),
  });
}

// Get single book
export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => bookService.getById(id),
    enabled: !!id,
  });
}

// Create book mutation
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => bookService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
    },
  });
}

// Update book mutation
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) =>
      bookService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
    },
  });
}

// Delete book mutation
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
    },
  });
}
