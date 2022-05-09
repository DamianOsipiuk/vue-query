import { QueryClient } from "../queryClient";

const queryClient = new QueryClient({
  logger: { ...console, error: () => {} },
  defaultOptions: {
    queries: { retry: false, cacheTime: Infinity },
  },
});

export const useQueryClient = jest.fn(() => queryClient);
