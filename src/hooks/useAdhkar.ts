import { useQuery } from '@tanstack/react-query';
import { adhkarService } from '../services';

// Query keys
export const adhkarKeys = {
  all: ['adhkar'] as const,
  lists: () => [...adhkarKeys.all, 'list'] as const,
  list: () => [...adhkarKeys.lists()] as const,
  details: () => [...adhkarKeys.all, 'detail'] as const,
  detail: (id: string) => [...adhkarKeys.details(), id] as const,
  category: (category: string) => [...adhkarKeys.all, 'category', category] as const,
};

// Get all adhkar
export function useAdhkar() {
  return useQuery({
    queryKey: adhkarKeys.list(),
    queryFn: () => adhkarService.getAll(),
  });
}

// Get single adhkar
export function useAdhkarById(id: string) {
  return useQuery({
    queryKey: adhkarKeys.detail(id),
    queryFn: () => adhkarService.getById(id),
    enabled: !!id,
  });
}

// Get adhkar by category
export function useAdhkarByCategory(category: string) {
  return useQuery({
    queryKey: adhkarKeys.category(category),
    queryFn: () => adhkarService.getByCategory(category),
    enabled: !!category,
  });
}
