import { isVue2 } from "vue-demi";
import { QueryClient } from "react-query/core";
import { VUE_QUERY_CLIENT } from "./useQueryClient";
import { QueryClientConfig } from "./useQueryProvider";

import type { Plugin } from "vue";

interface ConfigOptions {
  queryClientConfig?: QueryClientConfig;
  queryClientKey?: string;
}

interface ClientOptions {
  queryClient?: QueryClient;
  queryClientKey?: string;
}

type VueQueryPluginOptions = ConfigOptions | ClientOptions;

export const VueQueryPlugin: Plugin = {
  install: (app, options: VueQueryPluginOptions = {}) => {
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

    if (isVue2) {
      app.mixin({
        beforeCreate() {
          // HACK: taken from provide(): https://github.com/vuejs/composition-api/blob/master/src/apis/inject.ts#L30
          if (!this._provided) {
            const provideCache = {};
            Object.defineProperty(this, "_provided", {
              get: () => provideCache,
              set: (v) => Object.assign(provideCache, v),
            });
          }
          this._provided[VUE_QUERY_CLIENT + clientKeySuffix] = client;
        },
      });
    } else {
      app.provide(VUE_QUERY_CLIENT + clientKeySuffix, client);
    }
  },
};
