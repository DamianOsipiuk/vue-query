<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import type { Query } from "react-query/types";

import InfoPanel from "./InfoPanel.vue";

import { useTheme } from "../useTheme";
import { useQueryCacheUpdater } from "../useQueryCacheUpdater";
import { useQueryClient } from "../../useQueryClient";

export default defineComponent({
  name: "QueryActions",
  components: { InfoPanel },
  props: {
    query: {
      type: Object as PropType<Query>,
      required: true,
    },
  },
  setup(props) {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const isFetching = ref(false);

    useQueryCacheUpdater(props.query.queryHash, () => {
      isFetching.value = props.query.state.isFetching;
    });

    const doFetch = () => {
      props.query.fetch();
    };
    const doInvalidate = () => {
      queryClient.invalidateQueries(props.query);
    };
    const doReset = () => {
      queryClient.resetQueries(props.query);
    };
    const doRemove = () => {
      queryClient.removeQueries(props.query);
    };

    return {
      theme,
      isFetching,
      doFetch,
      doInvalidate,
      doReset,
      doRemove,
    };
  },
});
</script>

<template>
  <InfoPanel title="Actions">
    <button
      type="button"
      @click="doFetch"
      :disabled="isFetching"
      :style="{
        background: isFetching ? theme.grayAlt : theme.active,
        cursor: isFetching ? 'not-allowed' : 'pointer',
      }"
    >
      Refetch
    </button>
    <button
      type="button"
      @click="doInvalidate"
      :style="{
        background: theme.warning,
        color: theme.inputTextColor,
      }"
    >
      Invalidate
    </button>
    <button
      type="button"
      @click="doReset"
      :style="{
        background: theme.gray,
      }"
    >
      Reset
    </button>
    <button
      type="button"
      @click="doRemove"
      :style="{
        background: theme.danger,
      }"
    >
      Remove
    </button>
  </InfoPanel>
</template>

<style scoped>
button {
  appearance: none;
  border-radius: 0.3em;
  border: 0;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  padding: 0.5em;
}

button:not(:last-of-type) {
  margin-right: 5px;
}
</style>
