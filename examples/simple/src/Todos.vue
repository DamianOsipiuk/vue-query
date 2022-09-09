<script lang="ts">
import { defineComponent } from "vue";
import { useQuery } from "vue-query";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const fetcher = async (): Promise<Todo[]> =>
  await fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
    response.json()
  );

export default defineComponent({
  name: "TodoList",
  setup() {
    const { isLoading, isError, isFetching, data, error, refetch } = useQuery(
      ["todos"],
      fetcher
    );

    return { isLoading, isError, isFetching, data, error, refetch };
  },
});
</script>

<template>
  <p>
    Turn on <strong>network throttling</strong> in dev-tools and press Refetch
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
</template>

<style>
ul {
  list-style: none;
}
</style>
