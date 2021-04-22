[![NPM](https://img.shields.io/npm/v/vue-query)](https://www.npmjs.com/package/vue-query)
[![NPM](https://img.shields.io/npm/l/vue-query)](https://github.com/DamianOsipiuk/vue-query/blob/main/LICENSE)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-query)](https://bundlephobia.com/result?p=vue-query)

# vue-query

Hooks for fetching, caching and updating asynchronous data in Vue.

These hooks support Vue 2.x too via [vue-demi](https://github.com/vueuse/vue-demi)

Based on [react-query](https://github.com/tannerlinsley/react-query)

# Quick Features

- Transport/protocol/backend agnostic data fetching (REST, GraphQL, promises, whatever!)
- Auto Caching + Refetching (stale-while-revalidate, Window Refocus, Polling/Realtime)
- Parallel + Dependent Queries
- Mutations + Reactive Query Refetching
- Multi-layer Cache + Automatic Garbage Collection
- Paginated + Cursor-based Queries
- Load-More + Infinite Scroll Queries w/ Scroll Recovery
- Request Cancellation
- Dedicated Devtools
- [![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-query)](https://bundlephobia.com/result?p=vue-query) (depending on features imported)

# Examples

- 3.x
  - [Basic](https://github.com/DamianOsipiuk/vue-query/tree/main/examples/basic)
  - [Multi-Page](https://github.com/DamianOsipiuk/vue-query/tree/main/examples/multi-page)
    - Caching - throttle network and then switch between pages
    - Deduping requests - click `change page` in quick succession and monitor Network tab in devtools.
    - Garbage collection - click `remove page`
- 2.x
  - [Basic](https://github.com/DamianOsipiuk/vue-query/tree/main/examples/basic-vue-2.x)

# Installation

```
npm install vue-query
```

or

```
yarn add vue-query
```

# Usage

1. Attach vue-query to your Vue application

   ```ts
   import { createApp } from "vue";
   import { QueryClient, VUE_QUERY_CLIENT } from "vue-query";

   import App from "./App.vue";

   const queryClient = new QueryClient();
   queryClient.mount();

   createApp(App).provide(VUE_QUERY_CLIENT, queryClient).mount("#app");
   ```

2. Use query

   ```ts
   import { useQuery } from "vue-query";

   const query = useQuery("todos", getTodos);
   ```

3. If you need to update options on your query dynamically, make sure to pass it as reactive property

   ```ts
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

This package provides built-in devtools in the form of a Vue component.  
Use VueQueryDevTools component in the entry component of your application.

Check [Examples section](#examples).

**_Disclaimer: Devtools not supported on Vue 2.x_**

```vue
<script lang="ts">
import { defineComponent } from "vue";
import { VueQueryDevTools } from "vue-query/devtools";

export default defineComponent({
  name: "App",
  components: { VueQueryDevTools },
});
</script>

<template>
  <VueQueryDevTools />
</template>

```
