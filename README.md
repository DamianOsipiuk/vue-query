[![NPM](https://img.shields.io/npm/v/vue-react-query)](https://www.npmjs.com/package/vue-react-query) [![NPM](https://img.shields.io/npm/l/vue-react-query)](https://github.com/DamianOsipiuk/vue-react-query/blob/main/LICENSE)

# vue-react-query

Hooks for fetching, caching and updating asynchronous data in Vue.

Based on [react-query](https://github.com/tannerlinsley/react-query)

# Examples

- [Basic](https://github.com/DamianOsipiuk/vue-react-query/tree/main/examples/basic)

# Installation

**_This library requires Vue 3 to work properly_**

```
npm install vue-react-query
```

or

```
yarn add vue-react-query
```

# Usage

1. Attach vue-react-query to your Vue application

   ```
   import { QueryClient, VUE_REACT_QUERY_CLIENT } from "vue-react-query";
   import { createApp } from "vue";
   import App from "./App.vue";

   const app = createApp(App);
   const queryClient = new QueryClient();

   app.provide(VUE_REACT_QUERY_CLIENT, queryClient);

   app.mount("#app");
   ```

2. Use query

   ```
   import { useQuery } from "vue-react-query";
   const query = useQuery("todos", getTodos);
   ```

3. If you need to update options on your query dynamically, make sure to pass it as reactive property

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

# DevTools

This package provides built-in devtools in form of a Vue component.  
Use DevTools component in the entry component of your application.

Check [Examples section](#examples).

**_Disclaimer: you have to manually hide this component from production builds as of now._**

```
<script lang="ts">
import { defineComponent } from "vue";
import { VueQueryDevTools } from "vue-react-query";

export default defineComponent({
  name: "App",
  components: { VueQueryDevTools },
});
</script>

<template>
  <VueQueryDevTools />
</template>

```
