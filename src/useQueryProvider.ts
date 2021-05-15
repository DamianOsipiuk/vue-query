import { provide, onUnmounted } from "vue-demi";
import { QueryClient } from "react-query/core";

import { VUE_QUERY_CLIENT } from "./useQueryClient";

export function useQueryProvider(): void {
  const queryClient = new QueryClient();
  queryClient.mount();

  provide(VUE_QUERY_CLIENT, queryClient);

  onUnmounted(() => {
    queryClient.unmount();
  });
}
