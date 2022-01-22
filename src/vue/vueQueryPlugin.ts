import { isVue2 } from "vue-demi";
import { QueryClient } from "react-query/core";
import { VUE_QUERY_CLIENT } from "./useQueryClient";

import { QueryClientConfig } from "react-query/types/core";

import type { Plugin } from "vue";

export interface AdditionalClient {
  queryClient: QueryClient;
  queryClientKey: string;
}

interface ConfigOptions {
  queryClientConfig?: QueryClientConfig;
  queryClientKey?: string;
  additionalClients?: AdditionalClient[];
}

interface ClientOptions {
  queryClient?: QueryClient;
  queryClientKey?: string;
  additionalClients?: AdditionalClient[];
}

export type VueQueryPluginOptions = ConfigOptions | ClientOptions;

export const VueQueryPlugin: Plugin = {
  install: (app, options: VueQueryPluginOptions = {}) => {
    const clientKeySuffix = options.queryClientKey
      ? `:${options.queryClientKey}`
      : "";
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

    // @ts-expect-error onUnmount is not released yet
    if (app.onUnmount) {
      // @ts-expect-error onUnmount is not released yet
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
          this._provided[VUE_QUERY_CLIENT + clientKeySuffix] = client;

          options.additionalClients?.forEach((additionalClient) => {
            this._provided[
              `${VUE_QUERY_CLIENT}:${additionalClient.queryClientKey}`
            ] = additionalClient.queryClient;
            additionalClient.queryClient.mount();
          });
        },
      });
    } else {
      app.provide(VUE_QUERY_CLIENT + clientKeySuffix, client);

      options.additionalClients?.forEach((additionalClient) => {
        app.provide(
          `${VUE_QUERY_CLIENT}:${additionalClient.queryClientKey}`,
          additionalClient.queryClient
        );
        additionalClient.queryClient.mount();
      });
    }
  },
};
