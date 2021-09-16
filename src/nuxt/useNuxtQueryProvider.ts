import { useContext } from "@nuxtjs/composition-api";

import { hydrate } from "@/index";
import { useQueryClient, useQueryProvider } from "@/vue";
import type { QueryClientConfig } from "@/vue/useQueryProvider";

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
