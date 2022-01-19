import { InjectionKey } from "vue-demi";
import { QueryClient } from "react-query/core";
import { VUE_QUERY_CLIENT } from "./useQueryClient";
import { QueryClientConfig } from "./useQueryProvider";

type QueryClientPluginOptions =
  | {
      queryClientConfig?: QueryClientConfig;
      queryClientKey?: string;
    }
  | {
      queryClient?: QueryClient;
      queryClientKey?: string;
    };

// Vue 3 only
interface Vue3App {
  provide<T>(key: InjectionKey<T> | symbol | string, value: T): this;
}

export function VueQueryPlugin(
  app: Vue3App,
  options: QueryClientPluginOptions = {}
): void {
  const clientKeySuffix = options.queryClientKey || "";
  let client: QueryClient;

  if ("queryClient" in options && options.queryClient) {
    client = options.queryClient;
  } else {
    const clientConfig =
      "queryClientConfig" in options ? options.queryClientConfig : undefined;
    client = new QueryClient(clientConfig);
  }

  client.mount();

  app.provide(VUE_QUERY_CLIENT + clientKeySuffix, client);
}
