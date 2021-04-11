import {
  onUnmounted,
  toRefs,
  readonly,
  ToRefs,
  reactive,
  watchEffect,
} from "vue-demi";

import type { QueryObserver, QueryObserverResult } from "react-query/core";
import type { UseBaseQueryOptions, UseQueryResult } from "react-query/types";

import { useQueryClient } from "./useQueryClient";
import { updateState } from "./utils";

export function useBaseQuery<TQueryFnData, TError, TData, TQueryData>(
  options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData>,
  Observer: typeof QueryObserver
): ToRefs<Readonly<UseQueryResult<TData, TError>>> {
  const queryClient = useQueryClient();
  const observer = new Observer(
    queryClient,
    queryClient.defaultQueryObserverOptions(options)
  );
  const state = reactive(observer.getCurrentResult());
  const unsubscribe = observer.subscribe(
    (result: QueryObserverResult<TData, TError>) => {
      updateState(state, result);
    }
  );

  watchEffect(() => {
    observer.setOptions(queryClient.defaultQueryObserverOptions(options));
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return toRefs(readonly(state)) as ToRefs<
    Readonly<UseQueryResult<TData, TError>>
  >;
}
