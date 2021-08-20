/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MutationFunction,
  MutationKey,
  MutationOptions,
  QueryFunction,
  QueryKey,
  QueryOptions,
} from "react-query/types/core";
import type { QueryFilters } from "react-query/types/core/utils";

export function isQueryKey(value: unknown): value is QueryKey {
  return typeof value === "string" || Array.isArray(value);
}

export function parseQueryArgs<TOptions extends QueryOptions<any, any, any>>(
  arg1: QueryKey | TOptions,
  arg2: QueryFunction | TOptions = {} as TOptions,
  arg3: TOptions = {} as TOptions
): TOptions {
  if (!isQueryKey(arg1)) {
    return arg1 as TOptions;
  }

  if (typeof arg2 === "function") {
    return Object.assign(arg3, {
      queryKey: arg1,
      queryFn: arg2,
    }) as TOptions;
  }

  return Object.assign(arg2, { queryKey: arg1 }) as TOptions;
}

export function parseFilterArgs<
  TFilters extends QueryFilters,
  TOptions = unknown
>(
  arg1?: QueryKey | TFilters,
  arg2: TFilters | TOptions = {} as TOptions,
  arg3: TOptions = {} as TOptions
): [TFilters, TOptions | undefined] {
  if (isQueryKey(arg1)) {
    return [Object.assign(arg2, { queryKey: arg1 }), arg3] as [
      TFilters,
      TOptions
    ];
  }

  return [arg1 || {}, arg2] as [TFilters, TOptions];
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

export function updateState(
  state: Record<string, unknown>,
  update: Record<string, any>
): void {
  Object.keys(state).forEach((key) => {
    state[key] = update[key];
  });
}
