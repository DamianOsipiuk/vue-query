import { useContext } from "@nuxtjs/composition-api";
import { useQueryClient, useQueryProvider } from "../index";
import { hydrate } from "./hydration";

export function useNuxtQueryProvider(): void {
  useQueryProvider();

  // @ts-expect-error Nuxt.js injected client property
  if (process.client) {
    const { nuxtState } = useContext();
    if (nuxtState.vueQueryState) {
      const queryClient = useQueryClient();
      hydrate(queryClient, nuxtState.vueQueryState);
    }
  }
}