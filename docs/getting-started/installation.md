You can install Vue Query with [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

```bash
npm install vue-query
# or
yarn add vue-query
```

> If you are using Vue 2.x, make sure to also setup [@vue/composition-api](https://github.com/vuejs/composition-api)

### Vue Query Initialization

Before starting using Vue Query, you need to initialize it.

There are 2 possible ways to do it.

1. Using `VueQueryPlugin` (recommended)

   ```ts
   import { VueQueryPlugin } from "vue-query";

   app.use(VueQueryPlugin);
   ```

2. Calling `useQueryProvider` in the root component

   ```vue
   <script setup>
   import { useQueryProvider } from "vue-query";

   useQueryProvider();
   </script>
   ```

### Use of Composition API with `<script setup>`

All examples in our documentation use [`<script setup>`](https://staging.vuejs.org/api/sfc-script-setup.html) syntax.

Vue 2 users can also use that syntax using [this plugin](https://github.com/antfu/unplugin-vue2-script-setup). Please check the plugin documentation for installation details.

If you are not a fan of `<script setup>` syntax, you can easily translate all the examples into normal Composition API syntax by moving the code under `setup()` function and returning the values used in the template.

```vue
<script>
import { defineComponent } from "vue";
import { useQuery } from "vue-query";

function useTodosQuery() {
  return useQuery("todos", fetchTodoList);
}

export default defineComponent({
  name: "Todos",
  setup(props) {
    const { isLoading, isError, data, error, isFetching } = useTodosQuery();

    return { isLoading, isError, data, error, isFetching };
  },
});
</script>

<template>...</template>
```
