# vue-react-query

Vue bindings for react-query

# Usage

1. Installation

   `npm install vue-react-query`

2. Attach vue-react-query to your Vue application

   ```
   import { QueryClient } from "vue-react-query";
   import { createApp } from "vue";
   import App from "./App.vue";

   const app = createApp(App);
   const queryClient = new QueryClient();

   app.provide("queryClient", queryClient);

   app.mount("#app");
   ```

3. Use query

   ```
   import { useQuery } from "vue-react-query";
   const query = useQuery("todos", getTodos);
   ```

   If you need to update options on your query dynamically, make sure to pass it as reactive property

   ```
   const id = ref(1);
   const queryKey = reactive(["todos", { id }]);
   const queryFunction = () => getTodos(id),
   const options = reactive({
      staleTime: 60 * 60,
      onSuccess: () => {},
    });

   const query = useQuery(
     queryKey,
     queryFunction,
     options
   );
   ```
