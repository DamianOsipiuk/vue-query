<script lang="ts">
import { defineComponent } from "vue";
import { useQuery } from "vue-query";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const todoFetcher = async (): Promise<Todo[]> =>
  await fetch("https://jsonplaceholder.cypress.io/todos").then((response) =>
    response.json()
  );

export default defineComponent({
  name: "Page",

  props: {
    title: String,
  },
  setup() {
    const { isLoading, isError, isFetching, data, error, refetch } = useQuery(
      "todos",
      todoFetcher,
      {
        retry: 0,
        staleTime: 2000,
        cacheTime: 4000,
      }
    );
    useQuery("todos2", todoFetcher);
    useQuery("todos3", todoFetcher);

    return { isLoading, isError, isFetching, data, error, refetch };
  },
});
</script>

<template>
  <h1>{{ title }}</h1>
  <p>
    Turn on <strong>Slow 3G</strong> or <strong>Offline</strong> in dev-tools
    and hit Refetch
  </p>
  <button @click="refetch" :disabled="isFetching">
    {{ isFetching ? "Refetching..." : "Refetch" }}
  </button>
  <h2>TODO list</h2>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isError">An error has occurred: {{ error }}</div>
  <div v-else-if="data">
    <ul>
      <li v-for="item in data" :key="item.id">
        {{ item.completed ? "🗹" : "☐" }} {{ item.title }}
      </li>
    </ul>
  </div>
  <div v-else>Nothing to see here...</div>
</template>

<style>
ul {
  list-style: none;
}
</style>
