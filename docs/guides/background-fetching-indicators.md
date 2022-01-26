A query's `status === 'loading'` state is sufficient enough to show the initial hard-loading state for a query, but sometimes you may want to display an additional indicator that a query is refetching in the background.

To do this, queries also supply you with an `isFetching` boolean that you can use to show that it's in a fetching state, regardless of the state of the `status` variable:

?> The example below uses `<script setup>` syntax.

```vue
<script setup>
import { useQuery } from "vue-query";

function useTodosQuery() {
  return useQuery("todos", fetchTodoList);
}

const { isLoading, isError, data, error, isFetching } = useTodosQuery();
</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <div v-else>
    <span v-if="isFetching">Refreshing...</span>
    <ul>
      <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
    </ul>
  </div>
</template>
```

### Displaying Global Background Fetching Loading State

In addition to individual query loading states, if you would like to show a global loading indicator when **any** queries are fetching (including in the background), you can use the `useIsFetching` hook:

?> The example below uses `<script setup>` syntax.

```vue
<script setup>
import { useIsFetching } from "vue-query";

const isFetching = useIsFetching();
</script>

<template>
  <span v-if="isFetching">Queries are fetching in the background...</span>
</template>
```
