import { InfiniteData, InfiniteQueryObserver } from "react-query/core";

import type {
  QueryObserver,
  QueryFunction,
  QueryKey,
  InfiniteQueryObserverResult,
} from "react-query/types/core";

import { useBaseQuery, UseQueryReturnType } from "./useBaseQuery";

import type {
  WithQueryClientKey,
  VueInfiniteQueryObserverOptions,
} from "./types";
import { UseQueryOptions } from "./useQuery";

export type UseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = WithQueryClientKey<
  VueInfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >
>;

export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryReturnType<
  TData,
  TError,
  InfiniteQueryObserverResult<TData, TError>
>;
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: QueryKey,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey"
  >
): UseQueryReturnType<
  TData,
  TError,
  InfiniteQueryObserverResult<TData, TError>
>;
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >
): UseQueryReturnType<
  TData,
  TError,
  InfiniteQueryObserverResult<TData, TError>
>;
export function useInfiniteQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  arg1:
    | TQueryKey
    | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg2?:
    | QueryFunction<TQueryFnData, TQueryKey>
    | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryReturnType<
  TData,
  TError,
  InfiniteQueryObserverResult<TData, TError>
> {
  return useBaseQuery(
    InfiniteQueryObserver as typeof QueryObserver,
    arg1 as
      | TQueryKey
      | UseQueryOptions<
          InfiniteData<TQueryFnData>,
          TError,
          InfiniteData<TData>,
          TQueryKey
        >,
    arg2 as
      | QueryFunction<InfiniteData<TQueryFnData>, TQueryKey>
      | UseQueryOptions<
          InfiniteData<TQueryFnData>,
          TError,
          InfiniteData<TData>,
          TQueryKey
        >
      | undefined,
    arg3 as
      | UseQueryOptions<
          InfiniteData<TQueryFnData>,
          TError,
          InfiniteData<TData>,
          TQueryKey
        >
      | undefined
  ) as UseQueryReturnType<
    TData,
    TError,
    InfiniteQueryObserverResult<TData, TError>
  >;
}
