import {
  onUnmounted,
  toRefs,
  readonly,
  ToRefs,
  reactive,
  watchEffect,
} from "vue-demi";

import type { QueryObserver } from "react-query/core";
import type {
  UseBaseQueryOptions as UBQO,
  UseQueryResult,
} from "react-query/types/react/types";

import { useQueryClient } from "./useQueryClient";
import { updateState } from "./utils";
import { WithQueryClientKey } from "./types";

export type UseBaseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = unknown
> = WithQueryClientKey<UBQO<TQueryFnData, TError, TData, TQueryData>>;

export type UseQueryReturnType<
  TData,
  TError,
  Result = UseQueryResult<TData, TError>
> = ToRefs<Readonly<Result>> & {
  suspense: () => Promise<Result>;
};

export function useBaseQuery<TQueryFnData, TError, TData, TQueryData>(
  options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData>,
  Observer: typeof QueryObserver
): UseQueryReturnType<TData, TError> {
  const queryClient = useQueryClient(options.queryClientKey);
  const defaultedOptions = queryClient.defaultQueryObserverOptions(options);
  const observer = new Observer(queryClient, defaultedOptions);
  const state = reactive(observer.getCurrentResult());
  const unsubscribe = observer.subscribe((result) => {
    updateState(state, result);
  });

  watchEffect(() => {
    observer.setOptions(queryClient.defaultQueryObserverOptions(options));
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
}
