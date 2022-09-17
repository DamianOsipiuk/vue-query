import Vue, { h } from "vue";
import { VueQueryPlugin } from "vue-query";

import App from "./App.vue";

Vue.use(VueQueryPlugin);

const app = new Vue({
  el: "#app",
  render: () => {
    return h(App);
  },
});
