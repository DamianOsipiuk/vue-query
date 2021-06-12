<template>
  <div>
    <h1>About - Hi from {{ renderer }}</h1>
    <nuxt-link to="/">Index page</nuxt-link>
  </div>
</template>

<script>
import { defineComponent, useAsync, useContext } from "@nuxtjs/composition-api";

export default defineComponent({
  setup(props, attrs) {
    const { req } = useContext();
    const renderer = useAsync(() => (req ? "server" : "client"));

    return {
      renderer,
    };
  },
});
</script>
