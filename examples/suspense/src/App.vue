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
  <p>Turn on <b>Slow 3G</b> or <b>Offline</b> in dev-tools and hit Refetch</p>
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
