import { QueriesObserver } from "react-query/core";
import { computed, onUnmounted, readonly, ref, ToRefs, toRefs } from "vue";

import type { UseQueryOptions, UseQueryResult } from "react-query/types";

import { useQueryClient } from "./useQueryClient";

export function useQueries(
  queries: UseQueryOptions[]
): ToRefs<Readonly<UseQueryResult[]>> {
  const queryClient = useQueryClient();
  const observer = computed(() => new QueriesObserver(queryClient, queries));

  if (observer.value.hasListeners()) {
    observer.value.setQueries(queries);
  }

  const state = ref(observer.value.getCurrentResult());

  const unsubscribe = observer.value.subscribe((result) => {
    state.value = result;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return (toRefs(readonly(state)) as unknown) as ToRefs<
    Readonly<UseQueryResult[]>
  >;
}
