<script lang="ts">
import { defineComponent } from "vue";
import { VueQueryDevTools } from "vue-query/devtools";

import Todos from "./Todos.vue";

export default defineComponent({
  name: "App",
  components: { Todos, VueQueryDevTools },
});
</script>

<template>
  <h1>Vue Query - Simple</h1>
  <Todos />
  <VueQueryDevTools :initialIsOpen="true" />
</template>
