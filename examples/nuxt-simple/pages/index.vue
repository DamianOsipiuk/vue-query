<template>
  <div>
    <h1>Index - Hi from {{ renderer }}</h1>
    <nuxt-link to="/about">About page</nuxt-link>
    <button @click="refetch">Refetch</button>
    <p>{{ data }}</p>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ssrRef,
  onServerPrefetch,
  useContext,
} from "@nuxtjs/composition-api";
import { useQuery, useQueryClient, dehydrate } from "vue-query";

const fetcher = async () =>
  await fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
    response.json()
  );

export default defineComponent({
  setup() {
    const renderer = ssrRef("client", "renderer");

    const { refetch, data, suspense } = useQuery("todos", fetcher, {
      // If you do not want data to be refetched on the client, set a staleTime to high enough time
      staleTime: 5000,
    });

    onServerPrefetch(async () => {
      renderer.value = "server";
      const { ssrContext } = useContext();
      const queryClient = useQueryClient();
      await suspense();

      ssrContext.nuxt.vueQueryState = dehydrate(queryClient);
    });

    return {
      refetch,
      renderer,
      data,
    };
  },
});
</script>
