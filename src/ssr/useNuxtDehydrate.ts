import { dehydrate } from "./hydration";
import type { QueryClient } from "../index";

export function useNuxtDehydrate(
  ssrContext: {
    nuxt: Record<string, unknown>;
  },
  queryClient: QueryClient
): void {
  ssrContext.nuxt.vueQueryState = dehydrate(queryClient);
}
