import type {
  QueryKey,
  QueryObserverOptions,
  InfiniteQueryObserverOptions,
} from "react-query/types/core";
import { Ref } from "vue-demi";

export type MaybeRef<T> = Ref<T> | T;

export type MaybeRefConverter<TParams extends readonly any[]> = {
  [K in keyof TParams]: MaybeRef<TParams[K]>;
};

export type MaybeRefParams<F> = F extends (...args: infer T) => infer R
  ? (...args: MaybeRefConverter<T>) => R
  : never;

export type WithQueryClientKey<T> = T & { queryClientKey?: string };

// A Vue version of QueriesObserverOptions from "react-query/types/core"
// Accept refs as options
export type VueQueryObserverOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = {
  [Property in keyof QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >]: MaybeRef<
    QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >[Property]
  >;
};

// A Vue version of InfiniteQueryObserverOptions from "react-query/types/core"
// Accept refs as options
export type VueInfiniteQueryObserverOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = unknown,
  TQueryData = unknown,
  TQueryKey extends QueryKey = QueryKey
> = {
  [Property in keyof InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >]: MaybeRef<
    InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >[Property]
  >;
};
