Vue Query supports two ways of prefetching data on the server and passing that to the queryClient.

- Prefetch the data yourself and pass it in as `initialData`
  - Quick to set up for simple cases
  - Has some caveats
- Prefetch the query on the server, dehydrate the cache and rehydrate it on the client
  - Requires slightly more setup up front

## Using Nuxt.js

### Using Hydration

Vue Query supports prefetching multiple queries on the server in Nuxt.js and then _dehydrating_ those queries to the queryClient. This means the server can prerender markup that is immediately available on page load and as soon as JS is available, Vue Query can upgrade or _hydrate_ those queries with the full functionality of the library. This includes refetching those queries on the client if they have become stale since the time they were rendered on the server.

To support caching queries on the server and set up hydration:

- Use `useNuxtQueryProvider` inside setup function of your layout component

```js
// layouts/default.vue
<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";
import { useNuxtQueryProvider } from "vue-query/nuxt";

export default defineComponent({
  setup() {
    useNuxtQueryProvider();
  },
});
</script>

```

Now you are ready to prefetch some data in your pages with `onServerPrefetch`.

- Use `useQueryClient` to get server-side instance of queryClient
- Use `useContext` to get nuxt context
- Prefetch all the queries that you need with `prefetchQuery`
- Use `useNuxtDehydrate` to dehydrate the query cache and pass it to the client-side via nuxt context.

```js
// pages/todos.vue
<template>
  <div>
    <button @click="refetch">Refetch</button>
    <p>{{ data }}</p>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onServerPrefetch,
  useContext,
} from "@nuxtjs/composition-api";
import { useQuery, useQueryClient } from "vue-query";
import { useNuxtDehydrate } from "vue-query/nuxt";

export default defineComponent({
  setup() {
    // This will be prefetched and sent from the server
    const { refetch, data } = useQuery("todos", getTodos);
    // This won't be prefetched, it will start fetching on client side
    const { data2 } = useQuery("todos2", getTodos);

    onServerPrefetch(async () => {
      const { ssrContext } = useContext();
      const queryClient = useQueryClient();
      await queryClient.prefetchQuery("todos", getTodos);

      useNuxtDehydrate(ssrContext, queryClient);
    });

    return {
      refetch,
      data,
    };
  },
});
</script>
```

As demonstrated, it's fine to prefetch some queries and let others fetch on the queryClient. This means you can control what content server renders or not by adding or removing `prefetchQuery` for a specific query.

## Using Vite SSR

Sync VueQuery client state with [vite-ssr](https://github.com/frandiox/vite-ssr) in order to serialize it in the DOM:

```js
// main.js (entry point)
import App from "./App.vue";
import viteSSR from "vite-ssr/vue";
import { QueryClient, hydrate, dehydrate, VUE_QUERY_CLIENT } from "vue-query";

export default viteSSR(App, { routes: [] }, ({ app, initialState }) => {
  // -- This is Vite SSR main hook, which is called once per request

  // Create a fresh VueQuery client
  const client = new QueryClient();

  // Sync initialState with the client state
  if (import.meta.env.SSR) {
    // Indicate how to access and serialize VueQuery state during SSR
    initialState.vueQueryState = { toJSON: () => dehydrate(client) };
  } else {
    // Reuse the existing state in the browser
    hydrate(client, initialState.vueQueryState);
  }

  // Mount and provide the client to the app components
  client.mount();
  app.provide(VUE_QUERY_CLIENT, client);
});
```

Then, call VueQuery from any component using Vue's `onServerPrefetch`:

```html
<!-- MyComponent.vue -->
<template>
  <div>
    <button @click="refetch">Refetch</button>
    <p>{{ data }}</p>
  </div>
</template>

<script setup>
  import { useQuery } from "vue-query";
  import { onServerPrefetch } from "vue";

  // This will be prefetched and sent from the server
  const { refetch, data, suspense } = useQuery("todos", getTodos);
  onServerPrefetch(suspense);
</script>
```

## Tips, Tricks and Caveats

### Only successful queries are included in dehydration

Any query with an error is automatically excluded from dehydration. This means that the default behaviour is to pretend these queries were never loaded on the server, usually showing a loading state instead, and retrying the queries on the queryClient. This happens regardless of error.

Sometimes this behavior is not desirable, maybe you want to render an error page with a correct status code instead on certain errors or queries. In those cases, use `fetchQuery` and catch any errors to handle those manually.

### Staleness is measured from when the query was fetched on the server

A query is considered stale depending on when it was `dataUpdatedAt`. A caveat here is that the server needs to have the correct time for this to work properly, but UTC time is used, so timezones do not factor into this.

Because `staleTime` defaults to `0`, queries will be refetched in the background on page load by default. You might want to use a higher `staleTime` to avoid this double fetching, especially if you don't cache your markup.

This refetching of stale queries is a perfect match when caching markup in a CDN! You can set the cache time of the page itself decently high to avoid having to re-render pages on the server, but configure the `staleTime` of the queries lower to make sure data is refetched in the background as soon as a user visits the page. Maybe you want to cache the pages for a week, but refetch the data automatically on page load if it's older than a day?
