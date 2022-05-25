If you ever want to disable a query from automatically running, you can use the `enabled: false` option.

When `enabled` is `false`:

- If the query has cached data
  - The query will be initialized in the `status === 'success'` or `isSuccess` state.
- If the query does not have cached data
  - The query will start in the `status === 'loading'` and `fetchStatus === 'idle'`
- The query will not automatically fetch on mount.
- The query will not automatically refetch in the background.
- The query will ignore query client `invalidateQueries` and `refetchQueries` calls that would normally result in the query refetching.
- `refetch` returned from `useQuery` can be used to manually trigger the query to fetch.

```vue
<script setup>
import { useQuery } from "vue-query";

const { isIdle, isError, data, error, isFetching, refetch } = useQuery(
  ["todos"],
  fetchTodoList,
  { enabled: false }
);
</script>

<template>
  <button @click="refetch">Fetch</button>
  <span v-if="isIdle">Not ready...</span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <div v-else>
    <span v-if="isFetching">Fetching...</span>
    <ul>
      <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
    </ul>
  </div>
</template>
```

Permanently disabling a query opts out of many great features that react-query has to offer (like background refetches), and it's also not the idiomatic way. It takes you from the declartive approach (defining dependencies when your query should run) into an imperative mode (fetch whenever I click here). It is also not possible to pass parameters to refetch. Oftentimes, all you want is a lazy query that defers the initial fetch:

### Lazy Queries

The enabled option can not only be used to permenantly disable a query, but also to enable / disable it at a later time. A good example would be a filter form where you only want to fire off the first request once the user has entered a filter value:

```vue
<script setup>
import { useQuery } from "vue-query";

const filter = ref("");
const isEnabled = computed(() => !!filter.value);
const { data } = useQuery(
  ["todos", filter],
  fetchTodoList,
  // ⬇️ disabled as long as the filter is empty
  { enabled: isEnabled }
);
</script>

<template>
  <span v-if="data">Filter was set and data is here!</span>
</template>
```
