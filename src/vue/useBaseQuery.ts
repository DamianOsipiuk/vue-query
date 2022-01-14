import {
  onUnmounted,
  toRefs,
  readonly,
  ToRefs,
  reactive,
  unref,
  isRef,
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

import clonedeepwith from "lodash.clonedeepwith";

import { useQueryClient } from "./useQueryClient";
import { updateState } from "./utils";
import { WithQueryClientKey, VueQueryObserverOptions } from "./types";

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

type UseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = WithQueryClientKey<
  VueQueryObserverOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
>;

export function useBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>(
  Observer: typeof QueryObserver,
  arg1: TQueryKey | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg2:
    | QueryFunction<TQueryFnData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> = {},
  arg3: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> = {}
): UseQueryReturnType<TData, TError> {
  const options = getQueryOptions();
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
        queryClient.defaultQueryObserverOptions(getQueryOptions())
      );
    },
    { deep: true }
  );

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

  /**
   * Get Query Options object
   * All inner refs unwrapped. No Reactivity
   */
  function getQueryOptions() {
    let options;

    if (!isQueryKey(arg1)) {
      // `useQuery(optionsObj)`
      options = arg1;
    } else if (typeof arg2 === "function") {
      // `useQuery(queryKey, queryFn, optionsObj?)`
      options = {
        ...arg3,
        queryKey: arg1,
        queryFn: arg2,
      };
    } else {
      // `useQuery(queryKey, optionsObj?)`
      options = {
        ...arg2,
        queryKey: arg1,
      };
    }
    return cloneDeepUnref(options) as WithQueryClientKey<
      QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
    >;
  }
}

function cloneDeepUnref<T>(obj: T): UnwrapRef<T> {
  return clonedeepwith(obj, (val) => {
    if (typeof val === "function") {
      return val;
    }
    if (isRef(val)) {
      return unref(val);
    }
  });
}
function isQueryKey(value: unknown): value is QueryKey {
  return typeof value === "string" || Array.isArray(value);
}
