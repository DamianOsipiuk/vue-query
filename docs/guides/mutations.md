Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, Vue Query exports a `useMutation` hook.

Here's an example of a mutation that adds a new todo to the server:

```vue
<script>
import { useQuery } from "vue-query";

export default defineComponent({
  setup() {
    const { isLoading, isError, error, isSuccess, mutate } = useMutation(
      (newTodo) => {
        return axios.post("/todos", newTodo);
      }
    );

    function addTodo() {
      mutate({ id: new Date(), title: "Do Laundry" });
    }

    return { isLoading, isError, error, isSuccess, addTodo };
  },
});
</script>

<template>
  <span v-if="isLoading">Adding todo...</span>
  <span v-else-if="isError">An error occurred: {{ error.message }}</span>
  <span v-else-if="isSuccess">Todo added!</span>
  <button @click="addTodo">Create Todo</button>
</template>
```

A mutation can only be in one of the following states at any given moment:

- `isIdle` or `status === 'idle'` - The mutation is currently idle or in a fresh/reset state
- `isLoading` or `status === 'loading'` - The mutation is currently running
- `isError` or `status === 'error'` - The mutation encountered an error
- `isSuccess` or `status === 'success'` - The mutation was successful and mutation data is available

Beyond those primary states, more information is available depending on the state of the mutation:

- `error` - If the mutation is in an `error` state, the error is available via the `error` property.
- `data` - If the mutation is in a `success` state, the data is available via the `data` property.

In the example above, you also saw that you can pass variables to your mutations function by calling the `mutate` function with a **single variable or object**.

Even with just variables, mutations aren't all that special, but when used with the `onSuccess` option, the [Query Client's `invalidateQueries` method](https://react-query.tanstack.com/reference/QueryClient#queryclientinvalidatequeries) and the [Query Client's `setQueryData` method](https://react-query.tanstack.com/reference/QueryClient#queryclientsetquerydata), mutations become a very powerful tool.

### Resetting Mutation State

It's sometimes the case that you need to clear the `error` or `data` of a mutation request. To do this, you can use the `reset` function to handle this:

```vue
<script>
import { useQuery } from "vue-query";

export default defineComponent({
  setup() {
    const { error, mutate, reset } = useMutation(createTodo);

    function addTodo() {
      mutate({ id: new Date(), title: "Do Laundry" });
    }

    return { error, mutate, reset, addTodo };
  },
});
</script>

<template>
  <span v-else-if="error">
    <span>An error occurred: {{ error.message }}</span>
    <button @click="reset">Reset error</button>
  </span>
  <button @click="addTodo">Create Todo</button>
</template>
```

### Mutation Side Effects

`useMutation` comes with some helper options that allow quick and easy side-effects at any stage during the mutation lifecycle. These come in handy for both [invalidating and refetching queries after mutations](https://react-query.tanstack.com/guides/invalidations-from-mutations) and even [optimistic updates](https://react-query.tanstack.com/guides/optimistic-updates)

```js
useMutation(addTodo, {
  onMutate: (variables) => {
    // A mutation is about to happen!

    // Optionally return a context containing data to use when for example rolling back
    return { id: 1 };
  },
  onError: (error, variables, context) => {
    // An error happened!
    console.log(`rolling back optimistic update with id ${context.id}`);
  },
  onSuccess: (data, variables, context) => {
    // Boom baby!
  },
  onSettled: (data, error, variables, context) => {
    // Error or success... doesn't matter!
  },
});
```

When returning a promise in any of the callback functions it will first be awaited before the next callback is called:

```js
useMutation(addTodo, {
  onSuccess: async () => {
    console.log("I'm first!");
  },
  onSettled: async () => {
    console.log("I'm second!");
  },
});
```

You might find that you want to **trigger additional callbacks** than the ones defined on `useMutation` when calling `mutate`.  
This can be used to trigger component-specific side effects.  
To do that, you can provide any of the same callback options to the `mutate` function after your mutation variable.  
Supported overrides include: `onSuccess`, `onError` and `onSettled`.  
Please keep in mind that those additional callbacks won't run if your component unmounts **before** the mutation finishes.

```js
useMutation(addTodo, {
  onSuccess: (data, variables, context) => {
    // I will fire first
  },
  onError: (error, variables, context) => {
    // I will fire first
  },
  onSettled: (data, error, variables, context) => {
    // I will fire first
  },
});

mutate(todo, {
  onSuccess: (data, variables, context) => {
    // I will fire second!
  },
  onError: (error, variables, context) => {
    // I will fire second!
  },
  onSettled: (data, error, variables, context) => {
    // I will fire second!
  },
});
```

### Promises

Use `mutateAsync` instead of `mutate` to get a promise which will resolve on success or throw on an error. This can for example be used to compose side effects.

```js
const mutation = useMutation(addTodo);

function myAction() {
  try {
    const todo = await mutation.mutateAsync(todo);
    console.log(todo);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("done");
  }
}
```

### Retry

By default Vue Query **will not retry** a mutation on error, but it is possible with the `retry` option:

```js
const mutation = useMutation(addTodo, {
  retry: 3,
});
```

If mutations fail because the device is offline, they will be retried in the same order when the device reconnects.

### Persist mutations

Mutations can be persisted to storage if needed and resumed at a later point. This can be done with the hydration functions:

```js
const queryClient = new QueryClient();

// Define the "addTodo" mutation
queryClient.setMutationDefaults("addTodo", {
  mutationFn: addTodo,
  onMutate: async (variables) => {
    // Cancel current queries for the todos list
    await queryClient.cancelQueries("todos");

    // Create optimistic todo
    const optimisticTodo = { id: uuid(), title: variables.title };

    // Add optimistic todo to todos list
    queryClient.setQueryData("todos", (old) => [...old, optimisticTodo]);

    // Return context with the optimistic todo
    return { optimisticTodo };
  },
  onSuccess: (result, variables, context) => {
    // Replace optimistic todo in the todos list with the result
    queryClient.setQueryData("todos", (old) =>
      old.map((todo) => (todo.id === context.optimisticTodo.id ? result : todo))
    );
  },
  onError: (error, variables, context) => {
    // Remove optimistic todo from the todos list
    queryClient.setQueryData("todos", (old) =>
      old.filter((todo) => todo.id !== context.optimisticTodo.id)
    );
  },
  retry: 3,
});

// Start mutation in some component:
const mutation = useMutation("addTodo");
mutation.mutate({ title: "title" });

// If the mutation has been paused because the device is for example offline,
// Then the paused mutation can be dehydrated when the application quits:
const state = dehydrate(queryClient);

// The mutation can then be hydrated again when the application is started:
hydrate(queryClient, state);

// Resume the paused mutations:
queryClient.resumePausedMutations();
```
