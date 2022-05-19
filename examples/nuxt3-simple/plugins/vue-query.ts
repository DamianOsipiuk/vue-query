import {
  VueQueryPlugin,
  VueQueryPluginOptions,
  QueryClient,
  hydrate,
  dehydrate,
} from "vue-query";

export default (nuxt) => {
  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  });
  const options: VueQueryPluginOptions = { queryClient };

  nuxt.vueApp.use(VueQueryPlugin, options);

  // @ts-expect-error Nuxt process variable
  if (process.server) {
    nuxt.hooks.hook("app:rendered", () => {
      nuxt.nuxtState["vue-query"] = dehydrate(queryClient);
    });
  }

  // @ts-expect-error Nuxt process variable
  if (process.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, nuxt.nuxtState["vue-query"]);
    });
  }
};
