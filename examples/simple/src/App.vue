<script lang="ts">
import { defineComponent } from "vue";

import Todos from "./Todos.vue";

export default defineComponent({
  name: "App",
  components: { Todos },
});
</script>

<template>
  <h1>Vue Query - Simple</h1>
  <Todos />
</template>
