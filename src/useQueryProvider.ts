import { provide, onUnmounted } from "vue-demi";
import { QueryClient } from "react-query/core";

import { VUE_QUERY_CLIENT } from "./useQueryClient";

// QueryClientConfig isn't exported so we need to extract it
type QueryClientConfig = NonNullable<
  ConstructorParameters<typeof QueryClient>[0]
>;

export function useQueryProvider(config: QueryClientConfig = {}): void {
  const queryClient = new QueryClient(config);
  queryClient.mount();

  provide(VUE_QUERY_CLIENT, queryClient);

  onUnmounted(() => {
    queryClient.unmount();
  });
}
