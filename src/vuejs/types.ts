import type {
  QueryKey,
  QueryObserverOptions,
  InfiniteQueryObserverOptions,
} from "@tanstack/query-core";
import type { Ref } from "vue-demi";
import type { QueryClient } from "vue-query";

export type MaybeRef<T> = Ref<T> | T;
export type MaybeRefDeep<T> = T extends Function
  ? T
  : MaybeRef<
      T extends Array<unknown> | Record<string, unknown>
        ? {
            [Property in keyof T]: MaybeRefDeep<T[Property]>;
          }
        : T
    >;

export type WithQueryClientKey<T> = T & {
  queryClientKey?: string;
  queryClient?: QueryClient;
};

// A Vue version of QueriesObserverOptions from "@tanstack/query-core"
// Accept refs as options
export type VueQueryObserverOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = MaybeRefDeep<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
>;

// A Vue version of InfiniteQueryObserverOptions from "@tanstack/query-core"
// Accept refs as options
export type VueInfiniteQueryObserverOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = unknown,
  TQueryData = unknown,
  TQueryKey extends QueryKey = QueryKey
> = MaybeRefDeep<
  InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
>;
