Vue Query supports prefetching multiple queries on the server and then _dehydrating_ those queries to the queryClient. This means the server can prerender markup that is immediately available on page load and as soon as JS is available, Vue Query can upgrade or _hydrate_ those queries with the full functionality of the library. This includes refetching those queries on the client if they have become stale since the time they were rendered on the server.

## Using Nuxt.js

### Nuxt 3

First create `vue-query.ts` file in your `plugins` directory with the following content:
```ts
import {
  VueQueryPlugin,
  VueQueryPluginOptions,
  QueryClient,
  hydrate,
  dehydrate,
} from "vue-query";

export default (nuxt) => {
  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  });
  const options: VueQueryPluginOptions = { queryClient };

  nuxt.vueApp.use(VueQueryPlugin, options);

  if (process.server) {
    nuxt.hooks.hook("app:rendered", () => {
      nuxt.nuxtState["vue-query"] = dehydrate(queryClient);
    });
  }

  if (process.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, nuxt.nuxtState["vue-query"]);
    });
  }
};
```

Now you are ready to prefetch some data in your pages with `onServerPrefetch`.
- Prefetch all the queries that you need with `queryClient.prefetchQuery` or `suspense`

```ts
export default defineComponent({
  async setup() {
    const { data, suspense } = useQuery("test", fetcher);
    // This will prefetch query on server, and if `staleTime` is high enough skip fetching on client
    await suspense();

    return { data };
  },
});
```

### Nuxt 2

First create `vue-query.js` file in your `plugins` directory with the following content:

```ts
import Vue from "vue";
import { VueQueryPlugin, QueryClient, hydrate } from "vue-query";

export default (context) => {
  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  });
  const options = { queryClient };

  Vue.use(VueQueryPlugin, options);

  if (process.client) {
    if (context.nuxtState && context.nuxtState["vue-query"]) {
      hydrate(queryClient, context.nuxtState["vue-query"]);
    }
  }
};
```

Add this plugin to your `nuxt.config.js`
```js
module.exports = {
  ...
  plugins: ['~/plugins/vue-query.js'],
};
```

Now you are ready to prefetch some data in your pages with `onServerPrefetch`.

- Use `useContext` to get nuxt context
- Use `useQueryClient` to get server-side instance of `queryClient`
- Prefetch all the queries that you need with `queryClient.prefetchQuery` or `suspense`
- Dehydrate `queryClient` to the `nuxtContext`

```ts
import {
  defineComponent,
  onServerPrefetch,
  useContext,
} from "@nuxtjs/composition-api";
import { useQuery, useQueryClient, dehydrate } from "vue-query";

export default defineComponent({
  setup() {
    // This will be prefetched and sent from the server
    const { refetch, data, suspense } = useQuery("todos", getTodos);
    // This won't be prefetched, it will start fetching on client side
    const { data2 } = useQuery("todos2", getTodos);

    onServerPrefetch(async () => {
     const { ssrContext } = useContext();
      const queryClient = useQueryClient();
      await suspense();

      ssrContext.nuxt.vueQueryState = dehydrate(queryClient);
    });

    return {
      refetch,
      data,
    };
  },
});
```

As demonstrated, it's fine to prefetch some queries and let others fetch on the queryClient. This means you can control what content server renders or not by adding or removing `prefetchQuery` or `suspense` for a specific query.

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
