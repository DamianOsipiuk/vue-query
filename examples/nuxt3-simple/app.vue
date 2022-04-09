<template>
  <div>{{ data }}</div>
</template>

<script lang="ts">
import { useQuery } from "vue-query";
import { defineComponent, onServerPrefetch } from "vue";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const fetcher = async (): Promise<Post[]> =>
  await fetch("https://jsonplaceholder.typicode.com/posts").then((response) =>
    response.json()
  );

export default defineComponent({
  setup() {
    const { data, suspense } = useQuery("test", fetcher);

    onServerPrefetch(async () => {
      await suspense();
    });

    return { data };
  },
});
</script>
