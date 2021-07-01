import { QueriesObserver } from "react-query/core";
import { onUnmounted, reactive, readonly, set, watch } from "vue-demi";

import type { UseQueryOptions, UseQueryResult } from "react-query/types";

import { useQueryClient } from "./useQueryClient";

export function useQueries(
  queries: UseQueryOptions[]
): Readonly<UseQueryResult[]> {
  const queryClient = useQueryClient();
  const observer = new QueriesObserver(queryClient, queries);
  const state = reactive(observer.getCurrentResult());
  const unsubscribe = observer.subscribe((result) => {
    result.forEach((resultEntry, index) => {
      set(state, index, resultEntry);
    });
  });

  watch(
    () => queries,
    () => {
      observer.setQueries(queries);
    },
    { deep: true }
  );

  onUnmounted(() => {
    unsubscribe();
  });

  return readonly(state) as Readonly<UseQueryResult[]>;
}
