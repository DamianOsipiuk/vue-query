import Vue from "vue";
import { createApp, h } from "@vue/composition-api";
import VueCompositionApi from "@vue/composition-api";

import App from "./App.vue";
import { QueryClient, VUE_QUERY_CLIENT } from "vue-react-query";

Vue.use(VueCompositionApi);

const queryClient = new QueryClient();
queryClient.mount();

createApp({
  provide: {
    [VUE_QUERY_CLIENT]: queryClient,
  },
  render() {
    return h(App);
  },
}).mount("#app");
