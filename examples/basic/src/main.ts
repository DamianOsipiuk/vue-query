import { QueryClient, VUE_REACT_QUERY_CLIENT } from "../../../lib";
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
const queryClient = new QueryClient();

app.provide(VUE_REACT_QUERY_CLIENT, queryClient);

app.mount("#app");
