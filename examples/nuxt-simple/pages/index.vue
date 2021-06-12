<template>
  <div>
    <h1>Index - Hi from {{ renderer }}</h1>
    <nuxt-link to="/about">About page</nuxt-link>
    <button @click="refetch">Refetch</button>
    <p>{{ data }}</p>
  </div>
</template>

<script>
import {
  defineComponent,
  ssrRef,
  useContext,
  onServerPrefetch,
  onBeforeMount,
} from "@nuxtjs/composition-api";
import { QueryClient, useQuery, useQueryClient } from "vue-query";
import { hydrate, dehydrate } from "vue-query/ssr";

const fetcher = async () =>
  await fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
    response.json()
  );

export default defineComponent({
  setup(props, attrs) {
    const renderer = ssrRef("client");

    const { refetch, data } = useQuery("todos", fetcher, {
      enabled: false,
    });

    onBeforeMount(() => {
      const { nuxtState } = useContext();
      const queryClient = useQueryClient();
      hydrate(queryClient, nuxtState.vueQueryState);
    });

    onServerPrefetch(async () => {
      renderer.value = "server";

      const { ssrContext } = useContext();
      const queryClient = new QueryClient();
      await queryClient.prefetchQuery("todos", fetcher);

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
