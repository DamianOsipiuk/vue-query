import { createApp,h } from "@vue/composition-api";
import { QueryClient, VUE_REACT_QUERY_CLIENT } from "../../../lib";
import VueCompositionApi from '@vue/composition-api';
import App from "./App.vue";
import Vue from "vue";

Vue.use(VueCompositionApi)

const queryClient = new QueryClient();
queryClient.mount();

createApp({
  provide: {
    [VUE_REACT_QUERY_CLIENT]: queryClient
  },
  render() {
    return h(App);
  }
}).mount("#app");

