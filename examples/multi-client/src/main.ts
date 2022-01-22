import { createApp } from "vue";
import { VueQueryPlugin, VueQueryPluginOptions, QueryClient } from "vue-query";

import App from "./App.vue";

const fooClient = new QueryClient();
const barClient = new QueryClient();

const vueQueryPluginOptions: VueQueryPluginOptions = {
  additionalClients: [
    {
      queryClient: fooClient,
      queryClientKey: "Foo",
    },
    {
      queryClient: barClient,
      queryClientKey: "Bar",
    },
  ],
};

createApp(App).use(VueQueryPlugin, vueQueryPluginOptions).mount("#app");
