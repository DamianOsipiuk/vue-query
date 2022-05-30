## Breaking Changes

### ESM support

Vue Query now supports [package.json `"exports"`](https://nodejs.org/api/packages.html#exports) and is fully compatible with Node's native resolution for both CommonJS and ESM. We don't expect this to be a breaking change for most users, but this restricts the files you can import into your project to only the entry points we officially support.

### Query Keys (and Mutation Keys) need to be an Array

In v2, Query and Mutation Keys could be a String or an Array. Internally, Vue Query has always worked with Array Keys only, and we've sometimes exposed this to consumers. For example, in the `queryFn`, you would always get the key as an Array to make working with [Default Query Functions](guides/default-query-function) easier.

However, we have not followed this concept through to all apis. For example, when using the predicate function on Query Filters you would get the raw Query Key. This makes it difficult to work with such functions if you use Query Keys that are mixed Arrays and Strings. The same was true when using global callbacks.

To streamline all apis, we've decided to make all keys Arrays only:

```diff
- useQuery('todos', fetchTodos)
+ useQuery(['todos'], fetchTodos)
```

### Consistent behavior for `cancelRefetch`

The `cancelRefetch` option can be passed to all functions that imperatively fetch a query, namely:

- `queryClient.refetchQueries`
- `queryClient.invalidateQueries`
- `queryClient.resetQueries`
- `refetch` returned from `useQuery`
- `fetchNextPage` and `fetchPreviousPage` returned from `useInfiniteQuery`

Except for `fetchNextPage` and `fetchPreviousPage`, this flag was defaulting to `false`, which was inconsistent and potentially troublesome: Calling `refetchQueries` or `invalidateQueries` after a mutation might not yield the latest result if a previous slow fetch was already ongoing, because this refetch would have been skipped.

We believe that if a query is actively refetched by some code you write, it should, per default, re-start the fetch.

That is why this flag now defaults to _true_ for all methods mentioned above. It also means that if you call `refetchQueries` twice in a row, without awaiting it, it will now cancel the first fetch and re-start it with the second one:

```ts
queryClient.refetchQueries({ queryKey: ["todos"] });
// this will abort the previous refetch and start a new fetch
queryClient.refetchQueries({ queryKey: ["todos"] });
```

You can opt-out of this behaviour by explicitly passing `cancelRefetch: false`:

```ts
queryClient.refetchQueries({ queryKey: ["todos"] });
// this will not abort the previous refetch - it will just be ignored
queryClient.refetchQueries({ queryKey: ["todos"] }, { cancelRefetch: false });
```

> Note: There is no change in behaviour for automatically triggered fetches, e.g. because a query mounts or because of a window focus refetch.

### Query Filters

A [query filter](guides/filters) is an object with certain conditions to match a query. Historically, the filter options have mostly been a combination of boolean flags. However, combining those flags can lead to impossible states. Specifically:

```ts
active?: boolean
  - When set to true it will match active queries.
  - When set to false it will match inactive queries.
inactive?: boolean
  - When set to true it will match inactive queries.
  - When set to false it will match active queries.
```

Those flags don't work well when used together, because they are mutually exclusive. Setting `false` for both flags could match all queries, judging from the description, or no queries, which doesn't make much sense.

With v2, those filters have been combined into a single filter to better show the intent:

```diff
- active?: boolean
- inactive?: boolean
+ type?: 'active' | 'inactive' | 'all'
```

The filter defaults to `all`, and you can choose to only match `active` or `inactive` queries.

#### refetchActive / refetchInactive

[queryClient.invalidateQueries](https://react-query-beta.tanstack.com/reference/QueryClient#queryclientinvalidatequeries) had two additional, similar flags:

```ts
refetchActive: boolean
    - Defaults to true
    - When set to false, queries that match the refetch predicate and are actively being rendered via useQuery and friends will NOT be refetched in the background, and only marked as invalid.
refetchInactive: boolean
    - Defaults to false
    - When set to true, queries that match the refetch predicate and are not being rendered via useQuery and friends will be both marked as invalid and also refetched in the background
```

For the same reason, those have also been combined:

```diff
- active?: boolean
- inactive?: boolean
+ refetchType?: 'active' | 'inactive' | 'all' | 'none'
```

This flag defaults to `active` because `refetchActive` defaulted to `true`. This means we also need a way to tell `invalidateQueries` to not refetch at all, which is why a fourth option (`none`) is also allowed here.

### Streamlined NotifyEvents

Subscribing manually to the `QueryCache` has always given you a `QueryCacheNotifyEvent`, but this was not true for the `MutationCache`. We have streamlined the behavior and also adapted event names accordingly.

#### QueryCacheNotifyEvent

```diff
- type: 'queryAdded'
+ type: 'added'
- type: 'queryRemoved'
+ type: 'removed'
- type: 'queryUpdated'
+ type: 'updated'
```

#### MutationCacheNotifyEvent

The `MutationCacheNotifyEvent` uses the same types as the `QueryCacheNotifyEvent`.

> Note: This is only relevant if you manually subscribe to the caches via `queryCache.subscribe` or `mutationCache.subscribe`

### `onSuccess` is no longer called from `setQueryData`

This was confusing to many and also created infinite loops if `setQueryData` was called from within `onSuccess`. It was also a frequent source of error when combined with `staleTime`, because if data was read from the cache only, `onSuccess` was _not_ called.

Similar to `onError` and `onSettled`, the `onSuccess` callback is now tied to a request being made. No request -> no callback.

### The `cancel` method on promises is no longer supported

The old `cancel method` that allowed you to define a `cancel` function on promises, which was then used by the library to support query cancellation, has been removed. We recommend to use the [newer API](guides/query-cancellation) for query cancellation that uses the [`AbortController` API](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) internally and provides you with an [`AbortSignal` instance](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) for your query function to support query cancellation.

### Queries and mutations, per default, need network connection to run

Please read the [New Features announcement](#proper-offline-support) about online / offline support, and also the dedicated page about [Network mode](guides/network-mode)

Even though Vue Query is an Async State Manager that can be used for anything that produces a Promise, it is most often used for data fetching in combination with data fetching libraries. That is why, per default, queries and mutations will be `paused` if there is no network connection. If you want to opt-in to the previous behavior, you can globally set `networkMode: offlineFirst` for both queries and mutations:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
    },
    mutations: {
      networkmode: "offlineFirst",
    },
  },
});
```

### new API for `useQueries`

The `useQueries` hook now accepts an object with a `queries` prop as its input. The value of the `queries` prop is an array of queries (this array is identical to what was passed into `useQueries` in v1).

```diff
- useQueries([{ queryKey1, queryFn1, options1 }, { queryKey2, queryFn2, options2 }])
+ useQueries({ queries: [{ queryKey1, queryFn1, options1 }, { queryKey2, queryFn2, options2 }] })
```

### Removed undocumented methods from the `queryClient`, `query` and `mutation`

The methods `cancelMutatations` and `executeMutation` on the `QueryClient` were undocumented and unused internally, so we removed them. Since it was just a wrapper around a method available on the `mutationCache`, you can still use the functionality of `executeMutation`

Additionally, `query.setDefaultOptions` was removed because it was also unused. `mutation.cancel` was removed because it didn't actually cancel the outgoing request.

### Logging in production

Starting with v2, vue-query will no longer log errors (e.g. failed fetches) to the console in production mode, as this was confusing to many. Errors will still show up in development mode.

### `setLogger` is removed

It was possible to change the logger globally by calling `setLogger`. In v2, that function is replaced with an optional field when creating a `QueryClient`.

```diff
- import { QueryClient, setLogger } from 'vue-query';
+ import { QueryClient } from 'vue-query';

- setLogger(customLogger)
- const queryClient = new QueryClient();
+ const queryClient = new QueryClient({ logger: customLogger })
```

### Undefined is an illegal cache value for successful queries

In order to make bailing out of updates possible by returning `undefined`, we had to make `undefined` an illegal cache value. This is in-line with other concepts of vue-query, for example, returning `undefined` from the `initialData` function will also _not_ set data.

Further, it is an easy bug to produce `Promise<void>` by adding logging in the `queryFn`:

```ts
useQuery(["key"], () =>
  axios.get(url).then((result) => console.log(result.data))
);
```

This is now disallowed on type level; at runtime, `undefined` will be transformed to a _failed Promise_, which means you will get an `error`, which will also be logged to the console in development mode.

### The idle state has been removed

With the introduction of the new [fetchStatus](guides/queries#fetchstatus) for better offline support, the `idle` state became irrelevant, because `fetchStatus: 'idle'` captures the same state better. For more information, please read [Why two different states](guides/queries#why-two-different-states).

This will mostly affect `disabled` queries that don't have any `data` yet, as those were in `idle` state before:

```diff
- status: 'idle'
+ status: 'loading'
+ fetchStatus: 'idle'
```

Also, have a look at [the guide on dependent queries](guides/dependent-queries)

### No _default_ manual Garbage Collection server-side

In v2, Vue Query would cache query results for a default of 5 minutes, then manually garbage collect that data. This default was applied to server-side Vue Query as well.

This lead to high memory consumption and hanging processes waiting for this manual garbage collection to complete. In v2, by default the server-side `cacheTime` is now set to `Infinity` effectively disabling manual garbage collection (the NodeJS process will clear everything once a request is complete).

This change only impacts users of server-side Vue Query, such as with Nuxt.js. If you are setting a `cacheTime` manually this will not impact you (although you may want to mirror behavior).

### Removed devtools component in favor of official Vue Devtools plugin

Vue has [official and great devtools](https://devtools.vuejs.org/guide/installation.html), that supports plugins from third party libraries.
So instead of maintaning a custom component for both Vue versions which is actually a chore, we decided to go with a plugin for Vue devtools.

To migrate just remove the usage of the custom DevTools component and install Vue Devtools browser addon.
Vue-Query will seemlessly integrate with it adding a custom inspector and timeline events.

### Removed `additionalClients` option from `VueQueryPlugin`

Separating cache in the application should be done with `queryKey`, not with creating multiple `QueryClients`. Therefore possibility to create multiple clients in one application was removed.
In case you are using Vue2, which registers plugins globally instead of per-instance, you could use [custom context key](guides/custom-client?id=custom-context-key), to make sure that they will not clash.

### Removed `nuxt` utilities in favor of using `VueQueryPlugin`

<!-- TODO -->

### Removed `useQueryProvider` in favor of `VueQueryPlugin`

`VueQueryPlugin` is more powerfull and provides reliable way to register `vue-query` for both Vue 2 and Vue 3 with the same syntax.  
Also it's more in-line with the ecosystem, where users are used to Plugins and know immidiately how to use them.

Therefore `useQueryProvider` was removed to force uniform way of registering Vue-Query within the application.

```diff
- import { useQueryProvider } from "vue-query";
- defineComponent({
-   setup(props) {
-     useQueryProvider();
-   }
- })

+ import { VueQueryPlugin } from "vue-query";
+ app.use(VueQueryPlugin);
```

## New Features

### Proper offline support

In v1, Vue Query has always fired off queries and mutations, but then taken the assumption that if you want to retry it, you need to be connected to the internet. This has led to several confusing situations:

- You are offline and mount a query - it goes to loading state, the request fails, and it stays in loading state until you go online again, even though it is not really fetching.
- Similarly, if you are offline and have retries turned off, your query will just fire and fail, and the query goes to error state.
- You are offline and want to fire off a query that doesn't necessarily need network connection (because you _can_ use Vue Query for something other than data fetching), but it fails for some other reason. That query will now be paused until you go online again.
- Window focus refetching didn't do anything at all if you were offline.

With v2, Vue Query introduces a new `networkMode` to tackle all these issues. Please read the dedicated page about the new [Network mode](guides/network-mode) for more information.

### Mutation Cache Garbage Collection

Mutations can now also be garbage collected automatically, just like queries. The default `cacheTime` for mutations is also set to 5 minutes.

### Bailing out of updates with `setQueryData`

When using the [functional updater form of setQueryData](https://react-query-beta.tanstack.com/reference/QueryClient#queryclientsetquerydata), you can now bail out of the update by returning `undefined`. This is helpful if `undefined` is given to you as `previousValue`, which means that currently, no cached entry exists and you don't want to / cannot create one, like in the example of toggling a todo:

```ts
queryClient.setQueryData(["todo", id], (previousTodo) =>
  previousTodo ? { ...previousTodo, done: true } : undefined
);
```
