import { QueryClient } from '@tanstack/react-query';

let queryClientInstance: QueryClient | null = null;

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server-side: Always create a new QueryClient
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: false,
        },
      },
    });
  }

  if (!queryClientInstance) {
    // Client-side: Create the QueryClient once
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: false,
        },
      },
    });
  }

  return queryClientInstance;
};

export default getQueryClient;
