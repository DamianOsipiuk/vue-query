import { QueryObserver } from "react-query/core";
import type { QueryFunction, QueryKey } from "react-query/types/core";
import { watch } from "vue-demi";
import { useBaseQuery, UseQueryReturnType } from "./useBaseQuery";
import type { WithQueryClientKey, VueQueryObserverOptions } from "./types";

export type UseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = WithQueryClientKey<
  VueQueryObserverOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
>;

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryReturnType<TData, TError>;
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: QueryKey,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey"
  >
): UseQueryReturnType<TData, TError>;
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >
): UseQueryReturnType<TData, TError>;

export function useQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  arg1: TQueryKey | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg2?:
    | QueryFunction<TQueryFnData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg3?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryReturnType<TData, TError> &
  Promise<UseQueryReturnType<TData, TError>> {
  const returnValue = useBaseQuery(QueryObserver, arg1, arg2, arg3);

  const asyncDataPromise = new Promise<UseQueryReturnType<TData, TError>>(
    (resolve) => {
      const stopWatcher = watch(returnValue.isFetched, (isFetched) => {
        if (isFetched || returnValue.isIdle) {
          resolve(returnValue);
          stopWatcher();
        }
      });
    }
  );
  Object.assign(asyncDataPromise, returnValue);

  return asyncDataPromise as UseQueryReturnType<TData, TError> &
    Promise<UseQueryReturnType<TData, TError>>;
}
