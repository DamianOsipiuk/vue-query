import {
  onUnmounted,
  toRefs,
  readonly,
  ToRefs,
  reactive,
  unref,
  isRef,
  watch,
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
  const options = parseQueryArgs(arg1, arg2, arg3);
  // @ts-ignore
  const queryClient = useQueryClient(options.queryClientKey);
  // @ts-ignore
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
        queryClient.defaultQueryObserverOptions(
          // @ts-ignore
          parseQueryArgs(arg1, arg2, arg3)
        )
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
    // @ts-ignore
    suspense,
  };
}

function cloneDeepUnref<T>(obj: T): T {
  return clonedeepwith(obj, (val) => {
    if (typeof val === "function") {
      return val;
    }
    if (isRef(val)) {
      return unref(val);
    }
  });
}
function parseQueryArgs<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TOptions = QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >
>(
  arg1: QueryKey | TOptions,
  arg2: QueryFunction<TQueryFnData, TQueryKey> | TOptions = {} as TOptions,
  arg3: TOptions = {} as TOptions
): TOptions {
  // `useQuery(optionsObj)`
  if (!isQueryKey(arg1)) {
    return cloneDeepUnref(arg1);
  }
  // `useQuery(queryKey, queryFn, optionsObj?)`
  if (typeof arg2 === "function") {
    return cloneDeepUnref({
      ...arg3,
      queryKey: arg1,
      queryFn: arg2,
    });
  }
  // `useQuery(queryKey, optionsObj?)`
  return cloneDeepUnref({
    ...arg2,
    queryKey: arg1,
  });
}

function isQueryKey(value: unknown): value is QueryKey {
  return typeof value === "string" || Array.isArray(value);
}
