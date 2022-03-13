import { isRef } from "vue-demi";
import { QueryClient as QC } from "react-query/core";
import type {
  QueryKey,
  QueryClientConfig,
  SetDataOptions,
  ResetQueryFilters,
  ResetOptions,
  CancelOptions,
  InvalidateQueryFilters,
  InvalidateOptions,
  RefetchQueryFilters,
  RefetchOptions,
  FetchQueryOptions,
  QueryFunction,
  FetchInfiniteQueryOptions,
  InfiniteData,
  DefaultOptions,
  QueryObserverOptions,
  MutationKey,
  MutationObserverOptions,
} from "react-query/core";
import type {
  QueryFilters,
  MutationFilters,
  Updater,
} from "react-query/types/core/utils";
import type { QueryState } from "react-query/types/core/query";
import type { MaybeRef } from "./types";
import { cloneDeepUnref, isQueryKey } from "./utils";
import { QueryCache } from "./queryCache";
import { MutationCache } from "./mutationCache";

export class QueryClient extends QC {
  constructor(config: MaybeRef<QueryClientConfig> = {}) {
    const unreffedConfig = isRef(config) ? config.value : config;
    const vueQueryConfig: QueryClientConfig = {
      defaultOptions: cloneDeepUnref(unreffedConfig.defaultOptions),
      queryCache: unreffedConfig.queryCache || new QueryCache(),
      mutationCache: unreffedConfig.mutationCache || new MutationCache(),
    };
    super(vueQueryConfig);
  }

  isFetching(filters?: MaybeRef<QueryFilters>): number;
  isFetching(
    queryKey?: MaybeRef<QueryKey>,
    filters?: MaybeRef<QueryFilters>
  ): number;
  isFetching(
    arg1?: MaybeRef<QueryFilters | QueryKey>,
    arg2?: MaybeRef<QueryFilters>
  ): number {
    const arg1Unreffed = cloneDeepUnref(arg1);
    if (isQueryKey(arg1Unreffed)) {
      return super.isFetching(arg1Unreffed, cloneDeepUnref(arg2));
    }
    return super.isFetching(arg1Unreffed);
  }

  isMutating(filters?: MaybeRef<MutationFilters>): number {
    return super.isMutating(cloneDeepUnref(filters));
  }

  getQueryData<TData = unknown>(
    queryKey: MaybeRef<QueryKey>,
    filters?: MaybeRef<QueryFilters>
  ): TData | undefined {
    return super.getQueryData(
      cloneDeepUnref(queryKey),
      cloneDeepUnref(filters)
    );
  }

  getQueriesData<TData = unknown>(
    queryKey: MaybeRef<QueryKey>
  ): [QueryKey, TData][];
  getQueriesData<TData = unknown>(
    filters: MaybeRef<QueryFilters>
  ): [QueryKey, TData][];
  getQueriesData<TData = unknown>(
    queryKeyOrFilters: MaybeRef<QueryKey> | MaybeRef<QueryFilters>
  ): [QueryKey, TData][] {
    const unreffed = cloneDeepUnref(queryKeyOrFilters);
    if (isQueryKey(unreffed)) {
      return super.getQueriesData(unreffed);
    }
    return super.getQueriesData(unreffed);
  }

  setQueryData<TData>(
    queryKey: MaybeRef<QueryKey>,
    updater: Updater<TData | undefined, TData>,
    options?: MaybeRef<SetDataOptions>
  ): TData {
    return super.setQueryData(
      cloneDeepUnref(queryKey),
      updater,
      cloneDeepUnref(options)
    );
  }

  setQueriesData<TData>(
    queryKey: MaybeRef<QueryKey>,
    updater: Updater<TData | undefined, TData>,
    options?: MaybeRef<SetDataOptions>
  ): [QueryKey, TData][];
  setQueriesData<TData>(
    filters: MaybeRef<QueryFilters>,
    updater: Updater<TData | undefined, TData>,
    options?: MaybeRef<SetDataOptions>
  ): [QueryKey, TData][];
  setQueriesData<TData>(
    queryKeyOrFilters: MaybeRef<QueryKey | QueryFilters>,
    updater: Updater<TData | undefined, TData>,
    options?: MaybeRef<SetDataOptions>
  ): [QueryKey, TData][] {
    const arg1Unreffed = cloneDeepUnref(queryKeyOrFilters);
    if (isQueryKey(arg1Unreffed)) {
      return super.setQueriesData(
        arg1Unreffed,
        updater,
        cloneDeepUnref(options)
      );
    }
    return super.setQueriesData(arg1Unreffed, updater, cloneDeepUnref(options));
  }

  getQueryState<TData = unknown, TError = undefined>(
    queryKey: MaybeRef<QueryKey>,
    filters?: MaybeRef<QueryFilters>
  ): QueryState<TData, TError> | undefined {
    return super.getQueryState(
      cloneDeepUnref(queryKey),
      cloneDeepUnref(filters)
    );
  }

  removeQueries(filters?: MaybeRef<QueryFilters>): void;
  removeQueries(
    queryKey?: MaybeRef<QueryKey>,
    filters?: MaybeRef<QueryFilters>
  ): void;
  removeQueries(
    arg1?: MaybeRef<QueryKey | QueryFilters>,
    arg2?: MaybeRef<QueryFilters>
  ): void {
    const arg1Unreffed = cloneDeepUnref(arg1);
    if (isQueryKey(arg1Unreffed)) {
      return super.removeQueries(arg1Unreffed, cloneDeepUnref(arg2));
    }
    return super.removeQueries(arg1Unreffed);
  }

  resetQueries<TPageData = unknown>(
    filters?: MaybeRef<ResetQueryFilters<TPageData>>,
    options?: MaybeRef<ResetOptions>
  ): Promise<void>;
  resetQueries<TPageData = unknown>(
    queryKey?: MaybeRef<QueryKey>,
    filters?: MaybeRef<ResetQueryFilters<TPageData>>,
    options?: MaybeRef<ResetOptions>
  ): Promise<void>;
  resetQueries<TPageData = unknown>(
    arg1?: MaybeRef<QueryKey | ResetQueryFilters<TPageData>>,
    arg2?: MaybeRef<ResetQueryFilters<TPageData> | ResetOptions>,
    arg3?: MaybeRef<ResetOptions>
  ): Promise<void> {
    const arg1Unreffed = cloneDeepUnref(arg1);
    const arg2Unreffed = cloneDeepUnref(arg2);
    if (isQueryKey(arg1Unreffed)) {
      return super.resetQueries(
        arg1Unreffed,
        arg2Unreffed as ResetQueryFilters<TPageData> | undefined,
        cloneDeepUnref(arg3)
      );
    }
    return super.resetQueries(arg1Unreffed, arg2Unreffed as ResetOptions);
  }

  cancelQueries(
    filters?: MaybeRef<QueryFilters>,
    options?: MaybeRef<CancelOptions>
  ): Promise<void>;
  cancelQueries(
    queryKey?: MaybeRef<QueryKey>,
    filters?: MaybeRef<QueryFilters>,
    options?: MaybeRef<CancelOptions>
  ): Promise<void>;
  cancelQueries(
    arg1?: MaybeRef<QueryKey | QueryFilters>,
    arg2?: MaybeRef<QueryFilters | CancelOptions>,
    arg3?: MaybeRef<CancelOptions>
  ): Promise<void> {
    const arg1Unreffed = cloneDeepUnref(arg1);
    const arg2Unreffed = cloneDeepUnref(arg2);
    if (isQueryKey(arg1Unreffed)) {
      return super.cancelQueries(
        arg1Unreffed,
        arg2Unreffed as QueryFilters | undefined,
        cloneDeepUnref(arg3)
      );
    }
    return super.cancelQueries(arg1Unreffed, arg2Unreffed as CancelOptions);
  }

  invalidateQueries<TPageData = unknown>(
    filters?: MaybeRef<InvalidateQueryFilters<TPageData>>,
    options?: MaybeRef<InvalidateOptions>
  ): Promise<void>;
  invalidateQueries<TPageData = unknown>(
    queryKey?: MaybeRef<QueryKey>,
    filters?: MaybeRef<InvalidateQueryFilters<TPageData>>,
    options?: MaybeRef<InvalidateOptions>
  ): Promise<void>;
  invalidateQueries<TPageData = unknown>(
    arg1?: MaybeRef<QueryKey | InvalidateQueryFilters<TPageData>>,
    arg2?: MaybeRef<InvalidateQueryFilters<TPageData> | InvalidateOptions>,
    arg3?: MaybeRef<InvalidateOptions>
  ): Promise<void> {
    const arg1Unreffed = cloneDeepUnref(arg1);
    const arg2Unreffed = cloneDeepUnref(arg2);
    if (isQueryKey(arg1Unreffed)) {
      return super.invalidateQueries(
        arg1Unreffed,
        arg2Unreffed as InvalidateQueryFilters | undefined,
        cloneDeepUnref(arg3)
      );
    }
    return super.invalidateQueries(
      arg1Unreffed,
      arg2Unreffed as InvalidateOptions
    );
  }

  refetchQueries<TPageData = unknown>(
    filters?: MaybeRef<RefetchQueryFilters<TPageData>>,
    options?: MaybeRef<RefetchOptions>
  ): Promise<void>;
  refetchQueries<TPageData = unknown>(
    queryKey?: MaybeRef<QueryKey>,
    filters?: MaybeRef<RefetchQueryFilters<TPageData>>,
    options?: MaybeRef<RefetchOptions>
  ): Promise<void>;
  refetchQueries<TPageData = unknown>(
    arg1?: MaybeRef<QueryKey | RefetchQueryFilters<TPageData>>,
    arg2?: MaybeRef<RefetchQueryFilters<TPageData> | RefetchOptions>,
    arg3?: MaybeRef<RefetchOptions>
  ): Promise<void> {
    const arg1Unreffed = cloneDeepUnref(arg1);
    const arg2Unreffed = cloneDeepUnref(arg2);
    if (isQueryKey(arg1Unreffed)) {
      return super.refetchQueries(
        arg1Unreffed,
        arg2Unreffed as RefetchQueryFilters | undefined,
        cloneDeepUnref(arg3)
      );
    }
    return super.refetchQueries(arg1Unreffed, arg2Unreffed as RefetchOptions);
  }

  fetchQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: MaybeRef<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): Promise<TData>;
  fetchQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: MaybeRef<TQueryKey>,
    options?: MaybeRef<
      FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<TData>;
  fetchQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: MaybeRef<TQueryKey>,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: MaybeRef<
      FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<TData>;
  fetchQuery<
    TQueryFnData,
    TError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    arg1:
      | MaybeRef<TQueryKey>
      | MaybeRef<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>>,
    arg2?:
      | QueryFunction<TQueryFnData, TQueryKey>
      | MaybeRef<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>>,
    arg3?: MaybeRef<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): Promise<TData> {
    const arg1Unreffed = cloneDeepUnref(arg1);
    const arg2Unreffed = cloneDeepUnref(arg2);
    if (isQueryKey(arg1Unreffed)) {
      return super.fetchQuery(
        arg1Unreffed as TQueryKey,
        arg2Unreffed as QueryFunction<TQueryFnData, TQueryKey>,
        cloneDeepUnref(arg3) as FetchQueryOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryKey
        >
      );
    }
    return super.fetchQuery(
      arg1Unreffed as FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    );
  }

  prefetchQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: MaybeRef<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): Promise<void>;
  prefetchQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: MaybeRef<TQueryKey>,
    options?: MaybeRef<
      FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<void>;
  prefetchQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: MaybeRef<TQueryKey>,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: MaybeRef<
      FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<void>;
  prefetchQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    arg1: MaybeRef<
      TQueryKey | FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >,
    arg2?:
      | QueryFunction<TQueryFnData, TQueryKey>
      | MaybeRef<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>>,
    arg3?: MaybeRef<FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): Promise<void> {
    return super.prefetchQuery(
      cloneDeepUnref(arg1) as any,
      cloneDeepUnref(arg2) as any,
      cloneDeepUnref(arg3) as any
    );
  }

  fetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: MaybeRef<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<InfiniteData<TData>>;
  fetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: MaybeRef<TQueryKey>,
    options?: MaybeRef<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<InfiniteData<TData>>;
  fetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: MaybeRef<TQueryKey>,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: MaybeRef<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<InfiniteData<TData>>;
  fetchInfiniteQuery<
    TQueryFnData,
    TError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    arg1: MaybeRef<
      | TQueryKey
      | FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >,
    arg2?:
      | QueryFunction<TQueryFnData, TQueryKey>
      | MaybeRef<
          FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
        >,
    arg3?: MaybeRef<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<InfiniteData<TData>> {
    const arg1Unreffed = cloneDeepUnref(arg1);
    const arg2Unreffed = cloneDeepUnref(arg2);
    if (isQueryKey(arg1Unreffed)) {
      return super.fetchInfiniteQuery(
        arg1Unreffed as TQueryKey,
        arg2Unreffed as QueryFunction<TQueryFnData, TQueryKey>,
        cloneDeepUnref(arg3) as FetchInfiniteQueryOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryKey
        >
      );
    }
    return super.fetchInfiniteQuery(
      arg1Unreffed as FetchInfiniteQueryOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryKey
      >
    );
  }

  prefetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: MaybeRef<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<void>;
  prefetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: MaybeRef<TQueryKey>,
    options?: MaybeRef<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<void>;
  prefetchInfiniteQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: MaybeRef<TQueryKey>,
    queryFn: QueryFunction<TQueryFnData, TQueryKey>,
    options?: MaybeRef<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<void>;
  prefetchInfiniteQuery<
    TQueryFnData,
    TError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    arg1: MaybeRef<
      | TQueryKey
      | FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >,
    arg2?:
      | QueryFunction<TQueryFnData, TQueryKey>
      | MaybeRef<
          FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
        >,
    arg3?: MaybeRef<
      FetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>
    >
  ): Promise<void> {
    return super.prefetchInfiniteQuery(
      cloneDeepUnref(arg1) as any,
      cloneDeepUnref(arg2) as any,
      cloneDeepUnref(arg3) as any
    );
  }

  setDefaultOptions(options: MaybeRef<DefaultOptions>): void {
    super.setDefaultOptions(cloneDeepUnref(options));
  }

  setQueryDefaults(
    queryKey: MaybeRef<QueryKey>,
    options: MaybeRef<QueryObserverOptions<any, any, any, any>>
  ): void {
    super.setQueryDefaults(cloneDeepUnref(queryKey), cloneDeepUnref(options));
  }

  getQueryDefaults(
    queryKey?: MaybeRef<QueryKey>
  ): QueryObserverOptions<any, any, any, any, any> | undefined {
    return super.getQueryDefaults(cloneDeepUnref(queryKey));
  }

  setMutationDefaults(
    mutationKey: MaybeRef<MutationKey>,
    options: MaybeRef<MutationObserverOptions<any, any, any, any>>
  ): void {
    super.setMutationDefaults(
      cloneDeepUnref(mutationKey),
      cloneDeepUnref(options)
    );
  }

  getMutationDefaults(
    mutationKey?: MaybeRef<MutationKey>
  ): MutationObserverOptions<any, any, any, any> | undefined {
    return super.getMutationDefaults(cloneDeepUnref(mutationKey));
  }
}
