import { useContext } from "@nuxtjs/composition-api";
import type { QueryClientConfig } from "react-query/types/core";

import { hydrate, useQueryClient, useQueryProvider } from "vue-query";

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
