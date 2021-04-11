import { createApp } from "vue";
import { QueryClient, VUE_QUERY_CLIENT } from "../../../lib";

import App from "./App.vue";

const queryClient = new QueryClient();
queryClient.mount();

createApp(App).provide(VUE_QUERY_CLIENT, queryClient).mount("#app");
