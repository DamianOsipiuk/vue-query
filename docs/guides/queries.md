A query is a declarative dependency on an asynchronous source of data that is tied to a **unique key**. A query can be used with any Promise based method (including GET and POST methods) to fetch data from a server. If your method modifies data on the server, we recommend using **Mutations** instead.

To subscribe to a query in your components or custom hooks, call the `useQuery` hook with at least:

- A **unique key for the query**
- A function that returns a promise that:
  - Resolves the data, or
  - Throws an error

The **unique key** you provide is used internally for refetching, caching, and sharing your queries throughout your application.

The query results returned by `useQuery` contains all of the information about the query that you'll need for templating and any other usage of the data:

```js
import { useQuery } from "vue-query";

function App() {
  const result = useQuery("todos", fetchTodoList);
}
```

The `result` object contains a few very important states you'll need to be aware of to be productive. A query can only be in one of the following states at any given moment:

- `isLoading` or `status === 'loading'` - The query has no data and is currently fetching
- `isError` or `status === 'error'` - The query encountered an error
- `isSuccess` or `status === 'success'` - The query was successful and data is available
- `isIdle` or `status === 'idle'` - The query is currently disabled (you'll learn more about this in a bit)

Beyond those primary states, more information is available depending on the state of the query:

- `error` - If the query is in an `isError` state, the error is available via the `error` property.
- `data` - If the query is in a `success` state, the data is available via the `data` property.
- `isFetching` - In any state, if the query is fetching at any time (including background refetching) `isFetching` will be `true`.

For **most** queries, it's usually sufficient to check for the `isLoading` state, then the `isError` state, then finally, assume that the data is available and render the successful state:

```vue
<script>
import { defineComponent } from "vue";
import { useQuery } from "vue-query";

export default defineComponent({
  name: "Todo",
  setup(props) {
    const { isLoading, isError, data, error } = useQuery(
      "todos",
      fetchTodoList
    );
    return { isLoading, isError, data, error };
  },
});
</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <!-- We can assume by this point that `isSuccess === true` -->
  <ul v-else>
    <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
  </ul>
</template>
```

If booleans aren't your thing, you can always use the `status` state as well:

```vue
<script>
import { defineComponent } from "vue";
import { useQuery } from "vue-query";

export default defineComponent({
  name: "Todo",
  setup(props) {
    const { status, data, error } = useQuery(
      "todos",
      fetchTodoList
    );
    return { status, data, error };
  },
});
</script>

<template>
  <span v-if="status === 'loading'">Loading...</span>
  <span v-else-if="status === 'error'">Error: {{ error.message }}</span>
  <!-- also status === 'success', but "else" logic works, too -->
  <ul v-else>
    <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
  </ul>
</template>
```