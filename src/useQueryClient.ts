import { getCurrentInstance, inject } from "vue-demi";

import type { QueryClient } from "react-query/types/core";

export const VUE_QUERY_CLIENT = "VUE_QUERY_CLIENT";

export function useQueryClient(): QueryClient {
  const vm = getCurrentInstance()?.proxy;

  if (!vm) {
    throw new Error(
      "vue-query hooks can only be used inside setup() function."
    );
  }

  const queryClient = inject<QueryClient>(VUE_QUERY_CLIENT);

  if (!queryClient) {
    throw new Error(
      "No queryClient found in Vue context, use 'useQueryProvider' to set one in the root component."
    );
  }

  return queryClient;
}
