import { InfiniteQueryObserver } from "react-query/core";

import type {
  QueryObserver,
  QueryFunction,
  QueryKey,
} from "react-query/types/core";
import type {
  UseInfiniteQueryOptions as UIQO,
  UseInfiniteQueryResult,
} from "react-query/types/react/types";

import { useBaseQuery, UseQueryReturnType } from "./useBaseQuery";
import { parseQueryArgs } from "./utils";

import type { WithQueryClientKey } from "./types";

export type UseInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
> = WithQueryClientKey<UIQO<TQueryFnData, TError, TData>>;

export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError, UseInfiniteQueryResult<TData, TError>>;
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError, UseInfiniteQueryResult<TData, TError>>;
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError, UseInfiniteQueryResult<TData, TError>>;
export function useInfiniteQuery<TQueryFnData, TError, TData = TQueryFnData>(
  arg1: QueryKey | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
  arg2?:
    | QueryFunction<TQueryFnData>
    | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
  arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError, UseInfiniteQueryResult<TData, TError>> {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
  return useBaseQuery(
    parsedOptions,
    InfiniteQueryObserver as typeof QueryObserver
  ) as UseQueryReturnType<TData, TError, UseInfiniteQueryResult<TData, TError>>;
}
