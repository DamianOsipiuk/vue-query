import { QueryClient } from "../queryClient";

const queryClient = new QueryClient({
  logger: { log: () => {}, warn: () => {}, error: () => {} },
  defaultOptions: {
    queries: { retry: false, cacheTime: Infinity },
  },
});

export const useQueryClient = jest.fn(() => queryClient);
