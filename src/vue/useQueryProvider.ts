import { provide, onUnmounted } from "vue-demi";
import { QueryClient } from "react-query/core";
import type { QueryClientConfig } from "react-query/types/core";

import { VUE_QUERY_CLIENT } from "./useQueryClient";

export function useQueryProvider(
  arg1: QueryClientConfig | QueryClient = {},
  id = ""
): void {
  const suffix = id ? `:${id}` : "";
  const client = arg1 instanceof QueryClient ? arg1 : new QueryClient(arg1);

  client.mount();

  provide(VUE_QUERY_CLIENT + suffix, client);

  onUnmounted(() => {
    client.unmount();
  });
}
