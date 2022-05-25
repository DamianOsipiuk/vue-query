import {
  onScopeDispose,
  toRefs,
  readonly,
  ToRefs,
  reactive,
  watch,
  UnwrapRef,
} from "vue-demi";
import type {
  QueryObserver,
  QueryKey,
  QueryObserverOptions,
  QueryObserverResult,
} from "react-query/core";
import type { QueryFunction } from "react-query/types/core";
import { useQueryClient } from "./useQueryClient";
import { updateState, isQueryKey, cloneDeepUnref } from "./utils";
import { WithQueryClientKey } from "./types";
import type { UseQueryOptions } from "./useQuery";
import type { UseInfiniteQueryOptions } from "./useInfiniteQuery";

export type UseQueryReturnType<
  TData,
  TError,
  Result = QueryObserverResult<TData, TError>
> = ToRefs<Readonly<Result>> & {
  suspense: () => Promise<Result>;
};

type UseQueryOptionsGeneric<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey = QueryKey
> =
  | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
  | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>;

export function useBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>(
  Observer: typeof QueryObserver,
  arg1:
    | TQueryKey
    | UseQueryOptionsGeneric<TQueryFnData, TError, TData, TQueryKey>,
  arg2:
    | QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>
    | UseQueryOptionsGeneric<TQueryFnData, TError, TData, TQueryKey> = {},
  arg3: UseQueryOptionsGeneric<TQueryFnData, TError, TData, TQueryKey> = {}
): UseQueryReturnType<TData, TError> {
  const options = getQueryUnreffedOptions();
  const queryClient = useQueryClient(options.queryClientKey);
  const defaultedOptions = queryClient.defaultQueryObserverOptions(options);
  const observer = new Observer(queryClient, defaultedOptions);
  const state = reactive(observer.getCurrentResult());
  const unsubscribe = observer.subscribe((result) => {
    updateState(state, result);
  });

  watch(
    [() => arg1, () => arg2, () => arg3],
    () => {
      observer.setOptions(
        queryClient.defaultQueryObserverOptions(getQueryUnreffedOptions())
      );
    },
    { deep: true }
  );

  onScopeDispose(() => {
    unsubscribe();
  });

  return {
    ...(toRefs(readonly(state)) as UseQueryReturnType<TData, TError>),
    suspense: () => observer.fetchOptimistic(defaultedOptions),
  };

  /**
   * Get Query Options object
   * All inner refs unwrapped. No Reactivity
   */
  function getQueryUnreffedOptions() {
    let options;

    if (!isQueryKey(arg1)) {
      // `useQuery(optionsObj)`
      options = arg1;
    } else if (typeof arg2 === "function") {
      // `useQuery(queryKey, queryFn, optionsObj?)`
      options = { ...arg3, queryKey: arg1, queryFn: arg2 };
    } else {
      // `useQuery(queryKey, optionsObj?)`
      options = { ...arg2, queryKey: arg1 };
    }

    return cloneDeepUnref(options) as WithQueryClientKey<
      QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
    >;
  }
}
