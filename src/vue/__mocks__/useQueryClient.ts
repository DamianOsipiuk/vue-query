import { QueryClient } from "react-query/core";

const queryClient = new QueryClient();

export const useQueryClient = jest.fn(() => queryClient);
