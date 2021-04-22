<script lang="ts">
import { defineComponent } from "vue";
import { useQuery } from "vue-query";
import { VueQueryDevTools } from "vue-query/devtools";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const todoFetcher = async (): Promise<Todo[]> =>
  await fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
    response.json()
  );

export default defineComponent({
  name: "App",
  components: { VueQueryDevTools },
  setup() {
    const { isLoading, isError, isFetching, data, error, refetch } = useQuery(
      "todos",
      todoFetcher,
      {
        retry: 0,
        staleTime: 1000,
        cacheTime: 2000,
      }
    );

    return { isLoading, isError, isFetching, data, error, refetch };
  },
});
</script>

<template>
  <h1>vue-query example</h1>
  <p>Turn on <b>Slow 3G</b> or <b>Offline</b> in dev-tools and hit Refetch</p>
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
    <button @click="refetch" :disabled="isFetching">
      {{ isFetching ? "Refetching..." : "Refetch" }}
    </button>
  </div>
  <div v-else>Nothing to see here...</div>
  <VueQueryDevTools :initialIsOpen="true" />
</template>

<style>
ul {
  list-style: none;
}
</style>
