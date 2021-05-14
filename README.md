[![Vue Query logo](./media/vue-query.png)](https://damianosipiuk.github.io/vue-query/)

[![npm version](https://img.shields.io/npm/v/vue-query)](https://www.npmjs.com/package/vue-query)
[![npm license](https://img.shields.io/npm/l/vue-query)](https://github.com/DamianOsipiuk/vue-query/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vue-query)](https://bundlephobia.com/result?p=vue-query)
![npm](https://img.shields.io/npm/dm/vue-query)

# Vue Query

Hooks for fetching, caching and updating asynchronous data in Vue.

Support for Vue 2.x via [vue-demi](https://github.com/vueuse/vue-demi)

Based on [react-query](https://github.com/tannerlinsley/react-query)

# Documentation
Visit [damianosipiuk.github.io/vue-query](https://damianosipiuk.github.io/vue-query/)

# Quick Features

- Transport/protocol/backend agnostic data fetching (REST, GraphQL, promises, whatever!)
- Auto Caching + Refetching (stale-while-revalidate, Window Refocus, Polling/Realtime)
- Parallel + Dependent Queries
- Mutations + Reactive Query Refetching
- Multi-layer Cache + Automatic Garbage Collection
- Paginated + Cursor-based Queries
- Load-More + Infinite Scroll Queries w/ Scroll Recovery
- Request Cancellation
- [Suspense](https://v3.vuejs.org/guide/migration/suspense.html#introduction) + Fetch-As-You-Render Query Prefetching
- Dedicated Devtools
- [![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-query)](https://bundlephobia.com/result?p=vue-query) (depending on features imported)

# Quick Start

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
   const queryFunction = () => getTodos(id);
   const options = reactive({
     staleTime: 60 * 60,
     onSuccess: () => {},
   });

   const query = useQuery(queryKey, queryFunction, options);
   ```
