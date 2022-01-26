If you ever want to disable a query from automatically running, you can use the `enabled = false` option.

When `enabled` is `false`:

- If the query has cached data
  - The query will be initialized in the `status === 'success'` or `isSuccess` state.
- If the query does not have cached data
  - The query will start in the `status === 'idle'` or `isIdle` state.
- The query will not automatically fetch on mount.
- The query will not automatically refetch in the background when new instances mount or new instances appearing
- The query will ignore query client `invalidateQueries` and `refetchQueries` calls that would normally result in the query refetching.
- `refetch` can be used to manually trigger the query to fetch.

```vue
<script setup>
import { useQuery } from "vue-query";

function useTodosQuery({ enabled }) {
  return useQuery("todos", fetchTodoList, { enabled });
}

const { isIdle, isError, data, error, isFetching, refetch } = useTodosQuery({
  enabled: false,
});
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
