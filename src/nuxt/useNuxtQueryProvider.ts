import { useContext } from "@nuxtjs/composition-api";

import { hydrate, useQueryClient, useQueryProvider } from "vue-query";
import type { QueryClientConfig } from "vue-query";

export function useNuxtQueryProvider(config: QueryClientConfig = {}): void {
  useQueryProvider(config);

  // @ts-expect-error Nuxt.js injected client property
  if (process.client) {
    const { nuxtState } = useContext();
    if (nuxtState.vueQueryState) {
      const queryClient = useQueryClient();
      hydrate(queryClient, nuxtState.vueQueryState);
    }
  }
}
