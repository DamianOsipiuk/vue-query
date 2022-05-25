import type {
  QueryKey,
  QueryObserverOptions,
  InfiniteQueryObserverOptions,
} from "react-query/core";
import { Ref, UnwrapRef } from "vue-demi";

export type MaybeRef<T> = Ref<T> | T;
export type MaybeRefDeep<T> = T extends Function
  ? T
  : MaybeRef<
      T extends object
        ? {
            [Property in keyof T]: MaybeRefDeep<T[Property]>;
          }
        : T
    >;

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
  >]: Property extends "queryFn"
    ? QueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        UnwrapRef<TQueryKey>
      >[Property]
    : MaybeRef<
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
  >]: Property extends "queryFn"
    ? InfiniteQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        UnwrapRef<TQueryKey>
      >[Property]
    : MaybeRef<
        InfiniteQueryObserverOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryData,
          TQueryKey
        >[Property]
      >;
};
