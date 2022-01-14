import type { QueryKey, QueryObserverOptions } from "react-query/types/core";
import { Ref } from "vue-demi";

export type MaybeRef<T> = Ref<T> | T;

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
