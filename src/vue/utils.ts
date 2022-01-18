/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MutationFunction,
  MutationKey,
  MutationOptions,
  QueryFunction,
  QueryObserverOptions,
  QueryKey,
} from "react-query/types/core";
import { isRef, reactive, toRefs, unref, UnwrapRef } from "vue-demi";
import { QueryFilters } from "./useIsFetching";
import { MutationFilters } from "./useIsMutating";

export function isQueryKey(value: unknown): value is QueryKey {
  return typeof value === "string" || Array.isArray(value);
}

// This Function is Deprecated. It's not used internally anymore.
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
  let options;

  if (!isQueryKey(arg1)) {
    // `useQuery(optionsObj)`
    options = arg1;
  } else if (typeof arg2 === "function") {
    // `useQuery(queryKey, queryFn, optionsObj?)`
    options = {
      ...toRefs(reactive(arg3 as unknown as object)),
      queryKey: arg1,
      queryFn: arg2,
    };
  } else {
    // `useQuery(queryKey, optionsObj?)`
    options = {
      ...toRefs(reactive(arg2 as unknown as object)),
      queryKey: arg1,
    };
  }

  return reactive(options as object) as unknown as TOptions;
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

export function cloneDeep<T>(
  value: T,
  customizer?: (val: unknown) => unknown | void
): T {
  if (customizer) {
    const result = customizer(value);
    if (result !== undefined) {
      return result as typeof value;
    }
  }

  if (Array.isArray(value)) {
    return value.map((val) => cloneDeep(val, customizer)) as typeof value;
  }

  if (typeof value === "object" && isPlainObject(value)) {
    const entries = Object.entries(value).map(([key, val]) => [
      key,
      cloneDeep(val, customizer),
    ]);
    return Object.fromEntries(entries);
  }

  return value;
}

export function cloneDeepUnref<T>(obj: T): UnwrapRef<T> {
  return cloneDeep(obj, (val) => {
    if (isRef(val)) {
      return cloneDeepUnref(unref(val));
    }
  }) as UnwrapRef<typeof obj>;
}

function isPlainObject(value: unknown): boolean {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
