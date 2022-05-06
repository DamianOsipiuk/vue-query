import { isVue2 } from "vue-demi";
import type { QueryClientConfig } from "react-query/lib/core";

import { QueryClient } from "./queryClient";
import { getClientKey } from "./utils";
import { setupDevtools } from "./devtools/devtools";
import { MaybeRefDeep } from "./types";

export interface AdditionalClient {
  queryClient: QueryClient;
  queryClientKey: string;
}

interface ConfigOptions {
  queryClientConfig?: MaybeRefDeep<QueryClientConfig>;
  queryClientKey?: string;
  additionalClients?: AdditionalClient[];
}

interface ClientOptions {
  queryClient?: QueryClient;
  queryClientKey?: string;
  additionalClients?: AdditionalClient[];
}

export type VueQueryPluginOptions = ConfigOptions | ClientOptions;

export const VueQueryPlugin = {
  install: (app: any, options: VueQueryPluginOptions = {}) => {
    const clientKey = getClientKey(options.queryClientKey);
    let client: QueryClient;

    if ("queryClient" in options && options.queryClient) {
      client = options.queryClient;
    } else {
      const clientConfig =
        "queryClientConfig" in options ? options.queryClientConfig : undefined;
      client = new QueryClient(clientConfig);
    }

    client.mount();

    const cleanup = () => {
      client.unmount();
      options.additionalClients?.forEach((additionalClient) => {
        additionalClient.queryClient.unmount();
      });
    };

    if (app.onUnmount) {
      app.onUnmount(cleanup);
    } else {
      const originalUnmount = app.unmount;
      app.unmount = function vueQueryUnmount() {
        cleanup();
        originalUnmount();
      };
    }

    /* istanbul ignore next */
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
          this._provided[clientKey] = client;

          options.additionalClients?.forEach((additionalClient) => {
            const key = getClientKey(additionalClient.queryClientKey);
            this._provided[key] = additionalClient.queryClient;
            additionalClient.queryClient.mount();
          });

          if (process.env.NODE_ENV === "development") {
            setupDevtools(this, client);
          }
        },
      });
    } else {
      app.provide(clientKey, client);

      options.additionalClients?.forEach((additionalClient) => {
        const key = getClientKey(additionalClient.queryClientKey);
        app.provide(key, additionalClient.queryClient);
        additionalClient.queryClient.mount();
      });
    }
    if (process.env.NODE_ENV === "development") {
      setupDevtools(app, client);
    }
  },
};
