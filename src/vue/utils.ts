/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MutationFunction,
  MutationKey,
  MutationOptions,
  QueryFunction,
  QueryKey,
  QueryObserverOptions,
} from "react-query/types/core";
import { reactive, toRefs } from "vue-demi";
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
  let options: TOptions;

  if (!isQueryKey(arg1)) {
    // `useQuery(optionsObj)`
    options = reactive(arg1 as unknown as object) as unknown as TOptions;
  } else if (typeof arg2 === "function") {
    // `useQuery(queryKey, queryFn, optionsObj?)`
    options = reactive({
      ...toRefs(reactive(arg3 as unknown as object)),
      queryKey: arg1,
      queryFn: arg2,
    }) as TOptions;
  } else {
    // `useQuery(queryKey, optionsObj?)`
    options = reactive({
      ...toRefs(reactive(arg2 as unknown as object)),
      queryKey: arg1,
    }) as TOptions;
  }

  return options;
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
