<template>
  <div>
    <nuxt />
    <VueQueryDevTools />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import { useNuxtQueryProvider } from "vue-query/nuxt";
import { VueQueryDevTools } from "vue-query/devtools";

export default defineComponent({
  components: { VueQueryDevTools },
  setup() {
    useNuxtQueryProvider();
  },
});
</script>
