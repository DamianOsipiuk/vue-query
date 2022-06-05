/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MutationFunction,
  MutationKey,
  MutationOptions,
  QueryKey,
} from "react-query/lib/core";
import { isRef, unref, UnwrapRef } from "vue-demi";
import { MutationFilters } from "./useIsMutating";

export const VUE_QUERY_CLIENT = "VUE_QUERY_CLIENT";

export function getClientKey(key?: string) {
  const suffix = key ? `:${key}` : "";
  return `${VUE_QUERY_CLIENT}${suffix}`;
}

export function isQueryKey(value: unknown): value is QueryKey {
  return Array.isArray(value);
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
    return Object.assign(arg2 || ({} as MutationFilters), {
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
    if (result !== undefined || isRef(value)) {
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
