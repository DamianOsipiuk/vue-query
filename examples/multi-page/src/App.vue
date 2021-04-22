<script lang="ts">
import { defineComponent, ref } from "vue";

import { VueQueryDevTools } from "vue-query/devtools";
import Page from "./Page.vue";

export default defineComponent({
  name: "App",
  components: { VueQueryDevTools, Page },
  setup() {
    const firstPage = ref(1);

    const changePage = () => {
      firstPage.value = firstPage.value === 2 ? 1 : 2;
    };

    const remove = () => {
      firstPage.value = 3;
    };

    return { firstPage, changePage, remove };
  },
});
</script>

<template>
  <h1>vue-query example</h1>
  <button @click="changePage">Change Page</button>
  <button @click="remove">Remove page</button>
  <Page v-if="firstPage === 1" title="Page1" />
  <Page v-else-if="firstPage === 2" title="Page2" />
  <VueQueryDevTools :initialIsOpen="true" />
</template>

<style>
ul {
  list-style: none;
}
</style>
