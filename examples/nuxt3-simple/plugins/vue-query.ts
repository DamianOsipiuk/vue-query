import type { DehydratedState, VueQueryPluginOptions} from 'vue-query'
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from "vue-query";
// Nuxt 3 app aliases
import { useState} from '#app'

export default (nuxt) => {
  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  });
  const options: VueQueryPluginOptions = { queryClient };

  nuxt.vueApp.use(VueQueryPlugin, options);
  const vueQueryClient = useState<DehydratedState | null>('vue-query')

  // @ts-expect-error Nuxt process variable
  if (process.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryClient.value = dehydrate(queryClient)
    })
  }

  // @ts-expect-error Nuxt process variable
  if (process.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryClient.value)
    })
  }
};
