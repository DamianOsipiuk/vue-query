import { createApp } from "vue";
import { VueQueryPlugin } from "vue-query";

import App from "./App.vue";

createApp(App).use(VueQueryPlugin).mount("#app");
