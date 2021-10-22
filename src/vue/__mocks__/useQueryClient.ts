import { QueryClient } from "react-query/core";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, cacheTime: 10 },
  },
});

export const useQueryClient = jest.fn(() => queryClient);
