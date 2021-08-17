<script lang="ts">
import { defineComponent } from "vue";
import { useQueryProvider, QueryClient } from "vue-query";
import { VueQueryDevTools } from "vue-query/devtools";

import Todos from "./Todos.vue";

export default defineComponent({
  name: "App",
  components: { Todos, VueQueryDevTools },
  setup() {
    const myClient = new QueryClient();
    useQueryProvider();
    useQueryProvider({}, "Foo");
    useQueryProvider(myClient, "Bar");
  },
});
</script>

<template>
  <h1>Vue Query - Multi Client</h1>
  <Todos />
  <VueQueryDevTools :initialIsOpen="true" :queryClientKeys="['Foo', 'Bar']" />
</template>
