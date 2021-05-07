import {
  onUnmounted,
  toRefs,
  readonly,
  ToRefs,
  reactive,
  watchEffect,
  getCurrentInstance,
} from "vue-demi";

import type { QueryObserver } from "react-query/core";
import type { UseBaseQueryOptions, UseQueryResult } from "react-query/types";

import { useQueryClient } from "./useQueryClient";
import { updateState } from "./utils";

export type UseQueryReturnType<
  TData,
  TError,
  Result = UseQueryResult<TData, TError>
> = ToRefs<Readonly<Result>> & {
  suspense: () => Promise<Result> | void;
};

export function useBaseQuery<TQueryFnData, TError, TData, TQueryData>(
  options: UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryData>,
  Observer: typeof QueryObserver
): UseQueryReturnType<TData, TError> {
  const queryClient = useQueryClient();
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
  const currentInstance = getCurrentInstance();
  // @ts-expect-error Suspense is considered experimental and not exposed
  const isSuspense = Boolean(currentInstance?.suspense);
  const suspense = isSuspense
    ? () => observer.fetchOptimistic(defaultedOptions)
    : () => undefined;

  return {
    ...resultRefs,
    suspense,
  };
}
