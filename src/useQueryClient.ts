import { getCurrentInstance, inject } from "vue-demi";

import type { QueryClient } from "react-query/types/core";

export const VUE_QUERY_CLIENT = "VUE_QUERY_CLIENT";

export function useQueryClient(id = ""): QueryClient {
  const vm = getCurrentInstance()?.proxy;

  if (!vm) {
    throw new Error(
      "vue-query hooks can only be used inside setup() function."
    );
  }

  const suffix = id ? `:${id}` : "";
  const queryClient = inject<QueryClient>(VUE_QUERY_CLIENT + suffix);

  if (!queryClient) {
    throw new Error(
      "No queryClient found in Vue context, use 'useQueryProvider' to set one in the root component."
    );
  }

  return queryClient;
}
