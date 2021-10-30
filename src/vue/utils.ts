/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MutationFunction,
  MutationKey,
  MutationOptions,
  QueryFunction,
  QueryKey,
} from "react-query/types/core";
import type { UseBaseQueryOptions } from "react-query/types/react/types";
import { QueryFilters } from "./useIsFetching";
import { MutationFilters } from "./useIsMutating";

export function isQueryKey(value: unknown): value is QueryKey {
  return typeof value === "string" || Array.isArray(value);
}

export function parseQueryArgs<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TOptions = UseBaseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
>(
  arg1: QueryKey | TOptions,
  arg2: QueryFunction<TQueryFnData, TQueryKey> | TOptions,
  arg3: TOptions
): TOptions {
  if (!isQueryKey(arg1)) {
    return arg1;
  }

  if (typeof arg2 === "function") {
    return Object.assign(arg3, {
      queryKey: arg1,
      queryFn: arg2,
    });
  }

  return Object.assign(arg2, { queryKey: arg1 });
}

export function parseFilterArgs<TFilters extends QueryFilters>(
  arg1?: QueryKey | TFilters,
  arg2?: TFilters
): TFilters {
  if (isQueryKey(arg1)) {
    return Object.assign(arg2, { queryKey: arg1 });
  }

  return arg1 || ({} as TFilters);
}

export function parseMutationArgs<
  TOptions extends MutationOptions<any, any, any, any>
>(
  arg1: MutationKey | MutationFunction<any, any> | TOptions,
  arg2: MutationFunction<any, any> | TOptions = {} as TOptions,
  arg3: TOptions = {} as TOptions
): TOptions {
  if (isQueryKey(arg1)) {
    if (typeof arg2 === "function") {
      return Object.assign(arg3, {
        mutationKey: arg1,
        mutationFn: arg2,
      }) as TOptions;
    }
    return Object.assign(arg2, { mutationKey: arg1 }) as TOptions;
  }

  if (typeof arg1 === "function") {
    return Object.assign(arg2, { mutationFn: arg1 }) as TOptions;
  }

  return arg1;
}

export function parseMutationFilterArgs(
  arg1?: QueryKey | MutationFilters,
  arg2?: MutationFilters
): MutationFilters | undefined {
  if (isQueryKey(arg1)) {
    return Object.assign(arg2, {
      mutationKey: arg1,
    });
  }
  return arg1;
}

export function updateState(
  state: Record<string, unknown>,
  update: Record<string, any>
): void {
  Object.keys(state).forEach((key) => {
    state[key] = update[key];
  });
}
