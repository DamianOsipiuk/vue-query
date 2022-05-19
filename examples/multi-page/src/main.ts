import { createApp } from "vue";
import { VueQueryPlugin, VueQueryPluginOptions } from "vue-query";

import App from "./App.vue";

createApp(App)
  .use(VueQueryPlugin, { contextSharing: true } as VueQueryPluginOptions)
  .mount("#app");
// Second app mounted here will share vue-query context with the first app - click refresh to refresh both apps state
createApp(App)
  .use(VueQueryPlugin, { contextSharing: true } as VueQueryPluginOptions)
  .mount("#app2");
