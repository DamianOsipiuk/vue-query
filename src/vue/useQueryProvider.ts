import { provide, onScopeDispose } from "vue-demi";
import type { QueryClientConfig } from "react-query/types/core";
import { QueryClient } from "./queryClient";
import { getClientKey } from "./utils";
import { MaybeRefDeep } from "./types";

export function useQueryProvider(
  arg1: MaybeRefDeep<QueryClientConfig> | QueryClient = {},
  id = ""
): void {
  const client = arg1 instanceof QueryClient ? arg1 : new QueryClient(arg1);

  client.mount();

  const key = getClientKey(id);
  provide(key, client);

  onScopeDispose(() => {
    client.unmount();
  });
}
