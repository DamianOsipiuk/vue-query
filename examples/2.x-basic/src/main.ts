import Vue from "vue";
import VueCompositionApi, { createApp, h } from "@vue/composition-api";

import App from "./App.vue";

Vue.use(VueCompositionApi);

createApp({
  render() {
    return h(App);
  },
}).mount("#app");
