[![NPM](https://img.shields.io/npm/v/vue-react-query)](https://www.npmjs.com/package/vue-react-query) [![NPM](https://img.shields.io/npm/l/vue-react-query)](https://github.com/DamianOsipiuk/vue-react-query/blob/main/LICENSE)

# vue-react-query

Hooks for fetching, caching and updating asynchronous data in Vue.

These hooks support Vue 2.x too via [vue-demi](https://github.com/vueuse/vue-demi)

Based on [react-query](https://github.com/tannerlinsley/react-query)

# Examples

- 3.x
  - [Basic](https://github.com/DamianOsipiuk/vue-react-query/tree/main/examples/basic)
  - [Multi-Page](https://github.com/DamianOsipiuk/vue-react-query/tree/main/examples/multi-page)
    - Caching - throttle network and then switch between pages
    - Deduping requests - click `change page` in quick succession and monitor Network tab in devtools.
    - Garbage collection - click `remove page`
- 2.x
  - [Basic](https://github.com/DamianOsipiuk/vue-react-query/tree/main/examples/basic-vue2.x)

# Installation

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
   import { createApp } from "vue";
   import { QueryClient, VUE_QUERY_CLIENT } from "vue-react-query";

   import App from "./App.vue";

   const queryClient = new QueryClient();
   queryClient.mount();

   createApp(App).provide(VUE_QUERY_CLIENT, queryClient).mount("#app");
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

**Disclaimer:**  
**_You have to manually remove this component from production builds as of now._**  
**_Devtools are not supported on Vue 2.x_**

```
<script lang="ts">
import { defineComponent } from "vue";
import { VueQueryDevTools } from "vue-react-query/devtools";

export default defineComponent({
  name: "App",
  components: { VueQueryDevTools },
});
</script>

<template>
  <VueQueryDevTools />
</template>

```
