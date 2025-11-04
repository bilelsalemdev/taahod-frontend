import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService } from '../services';

// Query keys
export const progressKeys = {
  all: ['progress'] as const,
  lists: () => [...progressKeys.all, 'list'] as const,
  list: () => [...progressKeys.lists()] as const,
  book: (bookId: string) => [...progressKeys.all, 'book', bookId] as const,
  stats: () => [...progressKeys.all, 'stats'] as const,
};

// Get all progress
export function useProgress() {
  return useQuery({
    queryKey: progressKeys.list(),
    queryFn: () => progressService.getAll(),
  });
}

// Get progress for specific book
export function useBookProgress(bookId: string) {
  return useQuery({
    queryKey: progressKeys.book(bookId),
    queryFn: () => progressService.getByBook(bookId),
    enabled: !!bookId,
  });
}

// Get progress statistics
export function useProgressStats() {
  return useQuery({
    queryKey: progressKeys.stats(),
    queryFn: () => progressService.getStats(),
  });
}

// Save progress mutation
export function useSaveProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      bookId: string;
      currentPage: number;
      totalPages?: number;
      notes?: string;
    }) => progressService.save(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: progressKeys.book(variables.bookId) });
      queryClient.invalidateQueries({ queryKey: progressKeys.list() });
      queryClient.invalidateQueries({ queryKey: progressKeys.stats() });
    },
  });
}
