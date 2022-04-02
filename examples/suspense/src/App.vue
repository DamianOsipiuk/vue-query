<script lang="ts">
import { defineComponent } from "vue";

import Content from "./Content.vue";

export default defineComponent({
  name: "App",
  components: { Content },
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
</template>

<style>
ul {
  list-style: none;
}
</style>
