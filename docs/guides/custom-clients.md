### Custom client

Vue Query allows providing custom `QueryClient` for Vue context.

It might be handy when you need to create `QueryClient` beforehand to integrate it with other libraries that do not have access to the Vue context.

For this reason, `useQueryProvider` accepts either QueryClient options or `QueryClient` as a first argument.

If You provide QueryClient options, `QueryClient` instance will be created internally and provided to Vue context.

```js
useQueryProvider(queryClientOptions);
```

```js
const myClient = new QueryClient(queryClientOptions);
useQueryProvider(myClient);
```

### Custom context keys

You can also customize the key under which `QueryClient` will be accessible in Vue context. This can be usefull is you want to avoid name clashing between multiple apps on the same page.

It works both with default, and custom provided `QueryClient`

```js
useQueryProvider(queryClientOptions, "foo");
```

```js
const myClient = new QueryClient(queryClientOptions);
useQueryProvider(myClient, "bar");
```

To use the custom client key, You have to provide it as a query options

```js
useQuery("query1", fetcher, { queryClientKey: "foo" });
```

Devtools also support this by the `queryClientKeys` prop. You can provide multiple keys and switch between them to monitor multiple clients.

```vue
<template>
  <VueQueryDevTools :queryClientKeys="['foo', 'bar']" />
</template>
```

Internally custom key will be combined with default query key as a suffix. But user do not have to worry about it.

```js
useQueryProvider(queryClientOptions, "foo"); // -> VUE_QUERY_CLIENT:foo
```
