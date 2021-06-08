<template>
  <div>
    <nuxt />
    <VueQueryDevTools />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { useQueryProvider } from "vue-query";
import { VueQueryDevTools } from "vue-query/devtools";

export default defineComponent({
  components: { VueQueryDevTools },
  setup() {
    useQueryProvider();
  },
});
</script>
