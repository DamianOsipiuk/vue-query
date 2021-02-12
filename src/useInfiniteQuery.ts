import { InfiniteQueryObserver } from "react-query/core";
import { ToRefs } from "vue";

import type {
  QueryObserver,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from "react-query/types";

import { useBaseQuery } from "./useBaseQuery";
import { parseQueryArgs } from "./utils";

export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): ToRefs<UseInfiniteQueryResult<TData, TError>>;
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): ToRefs<UseInfiniteQueryResult<TData, TError>>;
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): ToRefs<UseInfiniteQueryResult<TData, TError>>;
export function useInfiniteQuery<TQueryFnData, TError, TData = TQueryFnData>(
  arg1: QueryKey | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
  arg2?:
    | QueryFunction<TQueryFnData>
    | UseInfiniteQueryOptions<TQueryFnData, TError, TData>,
  arg3?: UseInfiniteQueryOptions<TQueryFnData, TError, TData>
): ToRefs<UseInfiniteQueryResult<TData, TError>> {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
  return useBaseQuery(
    parsedOptions,
    InfiniteQueryObserver as typeof QueryObserver
  ) as ToRefs<UseInfiniteQueryResult<TData, TError>>;
}
