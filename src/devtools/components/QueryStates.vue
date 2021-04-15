<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import type { Query } from "react-query/types";

import { useTheme } from "../useTheme";
import { useQueryClient } from "../../useQueryClient";
import { getQueryState, QueryState, QueryStateLabel } from "../utils";

export default defineComponent({
  name: "QueryStates",
  setup() {
    const theme = useTheme();
    const queries: Ref<Query[]> = ref([]);

    const queryClient = useQueryClient();
    const queryCache = queryClient.getQueryCache();

    queryCache.subscribe(() => {
      queries.value = Object.values(queryCache.getAll());
    });

    const getQueryStateData = (state: QueryState) => {
      const count = queries.value.filter((q) => getQueryState(q) === state)
        .length;

      return {
        label: QueryStateLabel[state],
        opacity: count ? 1 : 0.3,
        count,
      };
    };

    const fresh = computed(() => getQueryStateData(QueryState.Fresh));
    const fetching = computed(() => getQueryStateData(QueryState.Fetching));
    const stale = computed(() => getQueryStateData(QueryState.Stale));
    const inactive = computed(() => getQueryStateData(QueryState.Inactive));

    return {
      theme,
      fresh,
      fetching,
      stale,
      inactive,
    };
  },
});
</script>

<template>
  <span class="query-states">
    <span
      class="query-state"
      :style="{
        background: theme.success,
        opacity: fresh.opacity,
      }"
    >
      {{ fresh.label }} {{ fresh.count }}
    </span>
    <span
      class="query-state"
      :style="{
        background: theme.active,
        opacity: fetching.opacity,
      }"
    >
      {{ fetching.label }} {{ fetching.count }}
    </span>
    <span
      class="query-state"
      :style="{
        background: theme.warning,
        color: 'black',
        textShadow: '0',
        opacity: stale.opacity,
      }"
    >
      {{ stale.label }} {{ stale.count }}
    </span>
    <span
      class="query-state"
      :style="{
        background: theme.gray,
        opacity: inactive.opacity,
      }"
    >
      {{ inactive.label }} {{ inactive.count }}
    </span>
  </span>
</template>

<style scoped>
.query-states {
  display: flex;
  font-size: 0.9em;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}
.query-state {
  align-items: center;
  border-radius: 0.2em;
  display: inline-flex;
  font-weight: bold;
  margin-left: 5px;
  padding: 0.2em 0.4em;
  text-shadow: 0 0 10px black;
}
</style>
