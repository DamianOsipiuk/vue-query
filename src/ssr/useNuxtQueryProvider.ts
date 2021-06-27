import { useContext } from "@nuxtjs/composition-api";
import { useQueryClient, useQueryProvider } from "../index";
import type { QueryClientConfig } from "../useQueryProvider";
import { hydrate } from "./hydration";

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
