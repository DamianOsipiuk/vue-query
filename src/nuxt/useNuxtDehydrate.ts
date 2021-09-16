import { dehydrate } from "@/index";
import type { QueryClient } from "@/index";

export function useNuxtDehydrate(
  ssrContext: {
    nuxt: Record<string, unknown>;
  },
  queryClient: QueryClient
): void {
  if (!ssrContext || !ssrContext.nuxt) {
    throw new Error(
      "Please provide `ssrContext` from nuxt `useContext` hook as a first parameter to `useNuxtDehydrate`"
    );
  } else {
    ssrContext.nuxt.vueQueryState = dehydrate(queryClient);
  }
}
