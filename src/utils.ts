import type {
  QueryFunction,
  QueryKey,
  QueryObserverResult,
  QueryOptions,
} from "react-query/types";

export function isQueryKey(value: unknown): value is QueryKey {
  return typeof value === "string" || Array.isArray(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseQueryArgs<TOptions extends QueryOptions<any, any, any>>(
  arg1: QueryKey | TOptions,
  arg2?: QueryFunction | TOptions,
  arg3?: TOptions
): TOptions {
  if (!isQueryKey(arg1)) {
    return arg1 as TOptions;
  }

  if (typeof arg2 === "function") {
    return { ...arg3, queryKey: arg1, queryFn: arg2 } as TOptions;
  }

  return { ...arg2, queryKey: arg1 } as TOptions;
}

export function updateState(
  state: Record<string, unknown>,
  update: QueryObserverResult
): void {
  Object.keys(state).forEach((key) => {
    // @ts-expect-error Typing issue
    state[key] = update[key];
  });
}
