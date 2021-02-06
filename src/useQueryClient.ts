import { inject } from "vue";

import type { QueryClient } from "react-query/types";

export function useQueryClient(): QueryClient {
  const queryClient = inject<QueryClient>("queryClient");

  if (!queryClient) {
    throw new Error(
      "No queryClient found in Vue context, use 'app.provide(\"queryClient\", queryClient);' to set one in root component."
    );
  }

  return queryClient;
}
