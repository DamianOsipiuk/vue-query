/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueriesObserver } from "react-query/core";
import { onUnmounted, reactive, readonly, set, watch } from "vue-demi";

import type {
  QueryFunction,
  QueryObserverResult,
} from "react-query/types/core";

import { useQueryClient } from "./useQueryClient";
import { UseQueryOptions } from "./useQuery";

// Avoid TS depth-limit error in case of large array literal
type MAXIMUM_DEPTH = 20;

type GetOptions<T> =
  // Part 1: responsible for applying explicit type parameter to function arguments, if object { queryFnData: TQueryFnData, error: TError, data: TData }
  T extends {
    queryFnData: infer TQueryFnData;
    error?: infer TError;
    data: infer TData;
  }
    ? UseQueryOptions<TQueryFnData, TError, TData>
    : T extends { queryFnData: infer TQueryFnData; error?: infer TError }
    ? UseQueryOptions<TQueryFnData, TError>
    : T extends { data: infer TData; error?: infer TError }
    ? UseQueryOptions<unknown, TError, TData>
    : // Part 2: responsible for applying explicit type parameter to function arguments, if tuple [TQueryFnData, TError, TData]
    T extends [infer TQueryFnData, infer TError, infer TData]
    ? UseQueryOptions<TQueryFnData, TError, TData>
    : T extends [infer TQueryFnData, infer TError]
    ? UseQueryOptions<TQueryFnData, TError>
    : T extends [infer TQueryFnData]
    ? UseQueryOptions<TQueryFnData>
    : // Part 3: responsible for inferring and enforcing type if no explicit parameter was provided
    T extends {
        queryFn?: QueryFunction<infer TQueryFnData>;
        select: (data: any) => infer TData;
      }
    ? UseQueryOptions<TQueryFnData, unknown, TData>
    : T extends { queryFn?: QueryFunction<infer TQueryFnData> }
    ? UseQueryOptions<TQueryFnData>
    : // Fallback
      UseQueryOptions;

type GetResults<T> =
  // Part 1: responsible for mapping explicit type parameter to function result, if object
  T extends { queryFnData: any; error?: infer TError; data: infer TData }
    ? QueryObserverResult<TData, TError>
    : T extends { queryFnData: infer TQueryFnData; error?: infer TError }
    ? QueryObserverResult<TQueryFnData, TError>
    : T extends { data: infer TData; error?: infer TError }
    ? QueryObserverResult<TData, TError>
    : // Part 2: responsible for mapping explicit type parameter to function result, if tuple
    T extends [any, infer TError, infer TData]
    ? QueryObserverResult<TData, TError>
    : T extends [infer TQueryFnData, infer TError]
    ? QueryObserverResult<TQueryFnData, TError>
    : T extends [infer TQueryFnData]
    ? QueryObserverResult<TQueryFnData>
    : // Part 3: responsible for mapping inferred type to results, if no explicit parameter was provided
    T extends {
        queryFn?: QueryFunction<any>;
        select: (data: any) => infer TData;
      }
    ? QueryObserverResult<TData>
    : T extends { queryFn?: QueryFunction<infer TQueryFnData> }
    ? QueryObserverResult<TQueryFnData>
    : // Fallback
      QueryObserverResult;

/**
 * UseQueriesOptions reducer recursively unwraps function arguments to infer/enforce type param
 */
export type UseQueriesOptions<
  T extends any[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = []
> = Depth["length"] extends MAXIMUM_DEPTH
  ? UseQueryOptions[]
  : T extends []
  ? []
  : T extends [infer Head]
  ? [...Result, GetOptions<Head>]
  : T extends [infer Head, ...infer Tail]
  ? UseQueriesOptions<[...Tail], [...Result, GetOptions<Head>], [...Depth, 1]>
  : unknown[] extends T
  ? T
  : // If T is *some* array but we couldn't assign unknown[] to it, then it must hold some known/homogenous type!
  // use this to infer the param types in the case of Array.map() argument
  T extends UseQueryOptions<infer TQueryFnData, infer TError, infer TData>[]
  ? UseQueryOptions<TQueryFnData, TError, TData>[]
  : // Fallback
    UseQueryOptions[];

/**
 * UseQueriesResults reducer recursively maps type param to results
 */
export type UseQueriesResults<
  T extends any[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = []
> = Depth["length"] extends MAXIMUM_DEPTH
  ? QueryObserverResult[]
  : T extends []
  ? []
  : T extends [infer Head]
  ? [...Result, GetResults<Head>]
  : T extends [infer Head, ...infer Tail]
  ? UseQueriesResults<[...Tail], [...Result, GetResults<Head>], [...Depth, 1]>
  : T extends UseQueryOptions<infer TQueryFnData, infer TError, infer TData>[]
  ? // Dynamic-size (homogenous) UseQueryOptions array: map directly to array of results
    QueryObserverResult<unknown extends TData ? TQueryFnData : TData, TError>[]
  : // Fallback
    QueryObserverResult[];

export function useQueries<T extends any[]>(
  queries: readonly [...UseQueriesOptions<T>]
): Readonly<UseQueriesResults<T>> {
  const queryClientKey = queries[0]?.queryClientKey;
  const queryClient = useQueryClient(queryClientKey);
  const defaultedQueries = queries.map((options) => {
    return queryClient.defaultQueryObserverOptions(options);
  });

  const observer = new QueriesObserver(queryClient, defaultedQueries);
  const state = reactive(observer.getCurrentResult());
  const unsubscribe = observer.subscribe((result) => {
    result.forEach((resultEntry, index) => {
      set(state, index, resultEntry);
    });
  });

  watch(
    () => queries,
    () => {
      const defaulted = queries.map((options) => {
        return queryClient.defaultQueryObserverOptions(options);
      });
      observer.setQueries(defaulted);
    },
    { deep: true }
  );

  onUnmounted(() => {
    unsubscribe();
  });

  return readonly(state) as UseQueriesResults<T>;
}
