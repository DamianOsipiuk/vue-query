import Vue from "vue";
import { createApp, h } from "@vue/composition-api";
import VueCompositionApi from "@vue/composition-api";

import App from "./App.vue";
import { QueryClient, VUE_REACT_QUERY_CLIENT } from "../../../lib";

Vue.use(VueCompositionApi);

const queryClient = new QueryClient();
queryClient.mount();

createApp({
  provide: {
    [VUE_REACT_QUERY_CLIENT]: queryClient,
  },
  render() {
    return h(App);
  },
}).mount("#app");
