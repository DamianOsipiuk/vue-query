Rendering paginated data is a very common UI pattern and in Vue Query, it **"just works"** by including the page information in the query key:

```js
const result = useQuery(["projects", page], fetchProjects);
```

However, if you run this simple example, you might notice something strange:

**The UI jumps in and out of the `success` and `loading` states because each new page is treated like a brand new query.**

This experience is not optimal and unfortunately is how many tools today insist on working. But not Vue Query!  
As you may have guessed, Vue Query comes with an awesome feature called `keepPreviousData` that allows us to get around this.

### Better Paginated Queries with `keepPreviousData`

Consider the following example where we would ideally want to increment a pageIndex (or cursor) for a query.  
If we were to use `useQuery`, **it would still technically work fine**, but the UI would jump in and out of the `success` and `loading` states as different queries are created and destroyed for each page or cursor.  
By setting `keepPreviousData` to `true` we get a few new things:

- **The data from the last successful fetch available while new data is being requested, even though the query key has changed.**
- When the new data arrives, the previous `data` is seamlessly swapped to show the new data.
- `isPreviousData` is available to know what data the query is currently providing to you.

```vue
<script setup lang="ts">
import { ref, Ref } from "vue";
import { useQuery } from "vue-query";

const fetcher = (page: Ref<number>) => async () =>
  await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page.value}&_limit=10`
  ).then((response) => response.json());

const page = ref(1);
const { isLoading, isError, data, error, isPreviousData } = useQuery(
  ["posts", page],
  fetcher(page),
  { keepPreviousData: true }
);
const prevPage = () => {
  page.value = Math.max(page.value - 1, 1);
};
const nextPage = () => {
  if (!isPreviousData.value) {
    page.value = page.value + 1;
  }
};
</script>

<template>
  <h1>Posts</h1>
  <p>Current Page: {{ page }} | Previous data: {{ isPreviousData }}</p>
  <button @click="prevPage">Prev Page</button>
  <button @click="nextPage">Next Page</button>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isError">An error has occurred: {{ error }}</div>
  <div v-else-if="data">
    <ul>
      <li v-for="item in data" :key="item.id">
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>
```

### Lagging Infinite Query results with `keepPreviousData`

While not as common, the `keepPreviousData` option also works flawlessly with the `useInfiniteQuery` hook, so you can seamlessly allow your users to continue to see cached data while infinite query keys change over time.
