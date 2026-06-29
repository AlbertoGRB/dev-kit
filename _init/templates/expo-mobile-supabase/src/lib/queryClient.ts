/** QueryClient singleton — compartilhado entre _layout.tsx e sync.ts. */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
      retry: 2,
      retryDelay: (a) => Math.min(1000 * 2 ** a, 10_000),
      networkMode: 'offlineFirst',
    },
    mutations: { networkMode: 'always' },
  },
});
