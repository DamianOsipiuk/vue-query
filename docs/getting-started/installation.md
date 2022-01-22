You can install Vue Query with [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### NPM

```
npm install vue-query
```

### Yarn

```
yarn add vue-query
```

Vue Query is compatible with Vue 2.x + composition API or 3.x

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
   import { useQueryProvider } from 'vue-query';

   useQueryProvider();
   </script>
   ```
