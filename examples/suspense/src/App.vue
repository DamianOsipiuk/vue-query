<script lang="ts">
import { defineComponent } from "vue";
import { useQueryProvider } from "vue-query";
import { VueQueryDevTools } from "vue-query/devtools";

import Content from "./Content.vue";

export default defineComponent({
  name: "App",
  components: { Content, VueQueryDevTools },
  setup() {
    useQueryProvider();
  },
});
</script>

<template>
  <h1>vue-query example</h1>
  <p>
    Turn on <strong>Slow 3G</strong> or <strong>Offline</strong> in dev-tools
    and hit Refetch
  </p>
  <Suspense>
    <template #default>
      <Content />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
  <VueQueryDevTools :initialIsOpen="true" />
</template>

<style>
ul {
  list-style: none;
}
</style>
