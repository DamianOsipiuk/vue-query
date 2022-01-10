import {
  onUnmounted,
  toRefs,
  readonly,
  ToRefs,
  reactive,
  watchEffect,
  unref,
} from "vue-demi";

import type {
  QueryObserver,
  QueryKey,
  QueryObserverOptions,
  QueryObserverResult,
} from "react-query/core";

import { useQueryClient } from "./useQueryClient";
import { updateState } from "./utils";
import { WithQueryClientKey } from "./types";

export type UseBaseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = unknown,
  TQueryKey extends QueryKey = QueryKey
> = WithQueryClientKey<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
>;

export type UseQueryReturnType<
  TData,
  TError,
  Result = QueryObserverResult<TData, TError>
> = ToRefs<Readonly<Result>> & {
  suspense: () => Promise<Result>;
};

export function useBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>(
  options: UseBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  Observer: typeof QueryObserver
): UseQueryReturnType<TData, TError> {
  const queryClient = useQueryClient(options.queryClientKey);
  const defaultedOptions = queryClient.defaultQueryObserverOptions(
    getOptionsWithUnrefKey(options)
  );
  const observer = new Observer(queryClient, defaultedOptions);
  const state = reactive(observer.getCurrentResult());
  const unsubscribe = observer.subscribe((result) => {
    updateState(state, result);
  });

  watchEffect(() => {
    observer.setOptions(
      queryClient.defaultQueryObserverOptions(getOptionsWithUnrefKey(options))
    );
  });

  onUnmounted(() => {
    unsubscribe();
  });

  const resultRefs = toRefs(readonly(state)) as UseQueryReturnType<
    TData,
    TError
  >;

  // Suspense
  const suspense = () => observer.fetchOptimistic(defaultedOptions);

  return {
    ...resultRefs,
    suspense,
  };

  // We need to unref keys, otherwise ReactQuery doesn't recognise keys changes
  function getOptionsWithUnrefKey<
    T extends { queryKey?: QueryKey | undefined }
  >(options: T): T {
    return Array.isArray(options.queryKey)
      ? { ...options, queryKey: options.queryKey.map(unref) }
      : options;
  }
}
