<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

import type { Options } from "../types";
import { useTheme } from "../useTheme";
import { sortFns } from "../utils";

export default defineComponent({
  name: "QueryOptions",
  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    optionsChange: (_options: Options) => true,
  },
  setup(_props, { emit }) {
    const theme = useTheme();
    const sorFnKeys = Object.keys(sortFns);

    const sort = ref(sorFnKeys[0]);

    const options = reactive({
      filter: "",
      sortDesc: false,
      sortFn: sortFns["Status > Last Updated"],
    });

    const onInput = (event: InputEvent) => {
      options.filter = (event.target as HTMLInputElement)?.value;

      emit("optionsChange", options);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        options.filter = "";
      }

      emit("optionsChange", options);
    };

    const onSortFnChange = (event: Event) => {
      sort.value = (event.target as HTMLSelectElement)?.value;
      options.sortFn = sortFns[sort.value];

      emit("optionsChange", options);
    };

    const onSortDescChange = () => {
      options.sortDesc = !options.sortDesc;

      emit("optionsChange", options);
    };

    return {
      theme,
      sorFnKeys,
      sort,
      options,
      onInput,
      onKeyDown,
      onSortFnChange,
      onSortDescChange,
    };
  },
});
</script>

<template>
  <div class="options-wrapper">
    <input
      placeholder="Filter"
      @input="onInput"
      @keydown="onKeyDown"
      :value="options.filter"
      :style="{
        backgroundColor: theme.inputBackgroundColor,
        color: theme.inputTextColor,
      }"
    />
    <select
      v-if="!options.filter"
      @change="onSortFnChange"
      :value="sort"
      :style="{
        backgroundColor: theme.inputBackgroundColor,
        color: theme.inputTextColor,
      }"
    >
      <option v-for="key in sorFnKeys" :key="key" :value="key">
        Sort by {{ key }}
      </option>
    </select>
    <button
      v-if="!options.filter"
      type="button"
      @click="onSortDescChange"
      :style="{
        background: theme.gray,
      }"
    >
      {{ options.sortDesc ? "⬇ Desc" : "⬆ Asc" }}
    </button>
  </div>
</template>

<style scoped>
.options-wrapper {
  align-items: center;
  display: flex;
}

input {
  border-radius: 0.2em;
  border: 0;
  flex: 1;
  font-size: 0.9em;
  line-height: 1.3;
  margin-right: 0.5rem;
  padding: 0.3em 0.4em;
}

button {
  appearance: none;
  background: #3f4e60;
  border-radius: 0.3em;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  padding: 0.3rem 0.4rem;
}

select {
  --webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23444444'><polygon points='0,25 100,25 50,75'/></svg>");
  background-position: right 0.55em center;
  background-repeat: no-repeat;
  background-size: 0.65em auto, 100%;
  border-radius: 0.2em;
  border: 0;
  display: inline-block;
  flex: 1;
  font-family: sans-serif;
  font-size: 0.9em;
  font-weight: normal;
  height: auto;
  line-height: 1.3;
  margin-right: 0.5rem;
  min-width: 75;
  padding: 0.3em 1.5em 0.3em 0.5em;
}
</style>
