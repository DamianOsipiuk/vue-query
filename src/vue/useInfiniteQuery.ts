import { InfiniteQueryObserver } from "react-query/core";
import type { UnwrapRef } from "vue-demi";
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

type UseInfiniteQueryReturnType<TData, TError> = UseQueryReturnType<
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
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseInfiniteQueryReturnType<TData, TError>;

export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey"
  >
): UseInfiniteQueryReturnType<TData, TError>;

export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>,
  options?: Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >
): UseInfiniteQueryReturnType<TData, TError>;

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
    | QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>
    | UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseInfiniteQueryReturnType<TData, TError> {
  return useBaseQuery(
    InfiniteQueryObserver as typeof QueryObserver,
    arg1,
    arg2,
    arg3
  ) as UseInfiniteQueryReturnType<TData, TError>;
}
