import { inject } from "vue-demi";

import type { QueryClient } from "react-query/types";

export const VUE_QUERY_CLIENT = "VUE_QUERY_CLIENT";

export function useQueryClient(): QueryClient {
  const queryClient = inject<QueryClient>(VUE_QUERY_CLIENT);

  if (!queryClient) {
    throw new Error(
      "No queryClient found in Vue context, use 'useQueryProvider' to set one in the root component."
    );
  }

  return queryClient;
}
