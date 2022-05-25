If you find yourself wishing for whatever reason that you could just share the same query function for your entire app and just use query keys to identify what it should fetch, you can do that by providing a **default query function** to Vue Query:

```ts
// Define a default query function that will receive the query key
const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com${queryKey[0]}`
  );
  return data;
};

// provide the default query function to your app with defaultOptions
const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: { queries: { queryFn: defaultQueryFn } },
  },
};
app.use(VueQueryPlugin, vueQueryPluginOptions);

// All you have to do now is pass a key!
const { status, data, error, isFetching } = useQuery(["/posts"]);

// You can even leave out the queryFn and just go straight into options
const { status, data, error, isFetching } = useQuery([`/posts/${postId}`], {
  enabled: !!postId,
});
```

If you ever want to override the default queryFn, you can just provide your own like you normally would.
