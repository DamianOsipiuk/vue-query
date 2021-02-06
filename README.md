# vue-query

Vue bindings for react-query

# Usage

1. Installation

   `npm install vue-query`

2. Attach vue-query to your Vue application

   ```
   import { QueryClient } from "vue-query";
   import { createApp } from "vue";
   import App from "./App.vue";

   const app = createApp(App);

   const queryClient = new QueryClient();

   app.provide("queryClient", queryClient);

   app.mount("#app");
   ```

3. Use query

   ```
   import { useQuery } from 'vue-query'
   const query = useQuery('todos', getTodos)
   ```
