<script lang="ts">
import { defineComponent } from "vue";

import { useTheme } from "../useTheme";

export default defineComponent({
  name: "InfoPanel",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const theme = useTheme();

    return {
      theme,
    };
  },
});
</script>

<template>
  <div
    class="title"
    :style="{
      background: theme.backgroundAlt,
    }"
  >
    {{ title }}
  </div>
  <div class="panel">
    <slot></slot>
  </div>
</template>

<style scoped>
.title {
  padding: 0.5rem;
  position: sticky;
  top: 0;
  z-index: 1;
}

.panel {
  padding: 0.5rem;
}
</style>
