import { QueryObserver } from "react-query/core";

import type { QueryFunction, QueryKey } from "react-query/types/core";
import type { UseQueryOptions } from "react-query/types/react/types";

import { useBaseQuery, UseQueryReturnType } from "./useBaseQuery";
import { parseQueryArgs } from "./utils";

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  options: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError>;
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  options?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError>;
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  options?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError>;
export function useQuery<TQueryFnData, TError, TData = TQueryFnData>(
  arg1: QueryKey | UseQueryOptions<TQueryFnData, TError, TData>,
  arg2?:
    | QueryFunction<TQueryFnData>
    | UseQueryOptions<TQueryFnData, TError, TData>,
  arg3?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryReturnType<TData, TError> {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
  return useBaseQuery(parsedOptions, QueryObserver);
}
