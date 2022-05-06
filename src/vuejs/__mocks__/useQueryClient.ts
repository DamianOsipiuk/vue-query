import { QueryClient } from "../queryClient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, cacheTime: 10 },
  },
});

export const useQueryClient = jest.fn(() => queryClient);
