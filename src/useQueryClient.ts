import { inject } from "vue";

import type { QueryClient } from "react-query/types";

export const VUE_REACT_QUERY_CLIENT = "VUE_REACT_QUERY_CLIENT";

export function useQueryClient(): QueryClient {
  const queryClient = inject<QueryClient>(VUE_REACT_QUERY_CLIENT);

  if (!queryClient) {
    throw new Error(
      "No queryClient found in Vue context, use 'app.provide(VUE_REACT_QUERY_CLIENT, new QueryClient());' to set one in root component."
    );
  }

  return queryClient;
}
