import { QueriesObserver } from "react-query/core";
import { onUnmounted, reactive, readonly, set, watch } from "vue-demi";

import type { UseQueryResult } from "react-query/types/react/types";

import { useQueryClient } from "./useQueryClient";
import { UseQueryOptions } from "./useQuery";

export function useQueries(
  queries: UseQueryOptions[]
): Readonly<UseQueryResult[]> {
  const queryClientKey = queries[0]?.queryClientKey;
  const queryClient = useQueryClient(queryClientKey);
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
