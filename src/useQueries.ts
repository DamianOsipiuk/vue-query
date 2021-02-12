import { QueriesObserver } from "react-query/core";
import {
  onUnmounted,
  reactive,
  readonly,
  ToRefs,
  toRefs,
  watchEffect,
} from "vue";

import type { UseQueryOptions, UseQueryResult } from "react-query/types";

import { useQueryClient } from "./useQueryClient";
import { updateState } from "./utils";

export function useQueries(
  queries: UseQueryOptions[]
): ToRefs<Readonly<UseQueryResult[]>> {
  const queryClient = useQueryClient();
  const observer = new QueriesObserver(queryClient, queries);
  const state = reactive(observer.getCurrentResult());
  const unsubscribe = observer.subscribe((result) => {
    state.forEach((stateEntry, index) => {
      updateState(stateEntry, result[index]);
    });
  });

  watchEffect(() => {
    observer.setQueries(queries);
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return (toRefs(readonly(state)) as unknown) as ToRefs<
    Readonly<UseQueryResult[]>
  >;
}
