import { provide, onUnmounted } from "vue-demi";
import { QueryClient } from "react-query/core";
import type { QueryClientConfig } from "react-query/types/core";
import { getClientKey } from "./utils";

export function useQueryProvider(
  arg1: QueryClientConfig | QueryClient = {},
  id = ""
): void {
  const client = arg1 instanceof QueryClient ? arg1 : new QueryClient(arg1);

  client.mount();

  const key = getClientKey(id);
  provide(key, client);

  onUnmounted(() => {
    client.unmount();
  });
}
