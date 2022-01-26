### Use custom composables (hooks) for queries

We find it useful to abstract queries into custom reusable composables and put them into separate files.

```ts
// component-folder/query.ts
import { useQuery } from "vue-query";

export function useTodoQuery(todoId, { enabled }) {
  return useQuery(
    ["todos", todoId],
    () => axios.get(`/todos/${todoId.value}`),
    {
      enabled,
      select: (todo) => todo.data,
    }
  );
}
```

```vue
<script>
import { ref } from "vue";
import { useTodoQuery } from "./query.ts";

const todoId = ref(null);

const { isLoading, data } = useTodosQuery(todoId, {
  enabled: computed(() => !!todoId),
});
</script>

<template>...</template>
```

It has the following advantages:

- the custom hook can easily be reused acrossed multiple components when they need access to the same data
- the component's logic is free from query implementation details => better separation of concerns
