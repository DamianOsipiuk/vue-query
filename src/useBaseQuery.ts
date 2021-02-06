import { onUnmounted, toRefs, readonly, ToRefs, ref, computed } from "vue";

import type { QueryObserver } from "react-query/core";
import type { UseBaseQueryOptions, UseQueryResult } from "react-query/types";

import { useQueryClient } from "./useQueryClient";

export function useBaseQuery<TQueryFnData, TError, TData, TQueryData>(
  options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData>,
  Observer: typeof QueryObserver
): ToRefs<Readonly<UseQueryResult<TData, TError>>> {
  const queryClient = useQueryClient();
  const defaultedOptions = computed(() =>
    queryClient.defaultQueryObserverOptions(options)
  );

  const observer = computed(
    () => new Observer(queryClient, defaultedOptions.value)
  );
  const state = ref(observer.value.getCurrentResult());

  const unsubscribe = observer.value.subscribe((result) => {
    state.value = result as never;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return (toRefs(readonly(state)) as unknown) as ToRefs<
    Readonly<UseQueryResult<TData, TError>>
  >;
}
