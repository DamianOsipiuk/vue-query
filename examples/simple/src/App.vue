<script lang="ts">
import { defineComponent } from "vue";
import { useQueryProvider } from "vue-query";
import { VueQueryDevTools } from "vue-query/devtools";

import Todos from "./Todos.vue";

export default defineComponent({
  name: "App",
  components: { Todos, VueQueryDevTools },
  setup() {
    useQueryProvider();
  },
});
</script>

<template>
  <h1>Vue Query - Simple</h1>
  <Todos />
  <VueQueryDevTools :initialIsOpen="true" />
</template>
