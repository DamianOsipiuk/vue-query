import type {
  QueryKey,
  QueryOptions,
  InfiniteQueryObserverResult,
  PlaceholderDataFunction,
  Query,
} from "react-query/types/core";
import { Ref } from "vue-demi";

export type MaybeRef<T> = Ref<T> | T;

export type WithQueryClientKey<T> = T & { queryClientKey?: string };

// A Vue version of QueriesObserverOptions from "react-query/types/core"
// Accept refs as options
export interface VueQueryObserverOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> extends QueryOptions<TQueryFnData, TError, TQueryData, TQueryKey> {
  /**
   * Set this to `false` to disable automatic refetching when the query mounts or changes query keys.
   * To refetch the query, use the `refetch` method returned from the `useQuery` instance.
   * Defaults to `true`.
   */
  enabled?: MaybeRef<boolean>;
  /**
   * The time in milliseconds after data is considered stale.
   * If set to `Infinity`, the data will never be considered stale.
   */
  staleTime?: MaybeRef<number>;
  /**
   * If set to a number, the query will continuously refetch at this frequency in milliseconds.
   * If set to a function, the function will be executed with the latest data and query to compute a frequency
   * Defaults to `false`.
   */
  refetchInterval?:
    | MaybeRef<number | false>
    | ((
        data: TData | undefined,
        query: Query<TQueryFnData, TError, TQueryData, TQueryKey>
      ) => number | false);
  /**
   * If set to `true`, the query will continue to refetch while their tab/window is in the background.
   * Defaults to `false`.
   */
  refetchIntervalInBackground?: MaybeRef<boolean>;
  /**
   * If set to `true`, the query will refetch on window focus if the data is stale.
   * If set to `false`, the query will not refetch on window focus.
   * If set to `'always'`, the query will always refetch on window focus.
   * Defaults to `true`.
   */
  refetchOnWindowFocus?: MaybeRef<boolean | "always">;
  /**
   * If set to `true`, the query will refetch on reconnect if the data is stale.
   * If set to `false`, the query will not refetch on reconnect.
   * If set to `'always'`, the query will always refetch on reconnect.
   * Defaults to `true`.
   */
  refetchOnReconnect?: MaybeRef<boolean | "always">;
  /**
   * If set to `true`, the query will refetch on mount if the data is stale.
   * If set to `false`, will disable additional instances of a query to trigger background refetches.
   * If set to `'always'`, the query will always refetch on mount.
   * Defaults to `true`.
   */
  refetchOnMount?: MaybeRef<boolean | "always">;
  /**
   * If set to `false`, the query will not be retried on mount if it contains an error.
   * Defaults to `true`.
   */
  retryOnMount?: MaybeRef<boolean>;
  /**
   * If set, the component will only re-render if any of the listed properties change.
   * When set to `['data', 'error']`, the component will only re-render when the `data` or `error` properties change.
   * When set to `tracked`, access to properties will be tracked, and the component will only re-render when one of the tracked properties change.
   */
  notifyOnChangeProps?: Array<keyof InfiniteQueryObserverResult> | "tracked";
  /**
   * If set, the component will not re-render if any of the listed properties change.
   */
  notifyOnChangePropsExclusions?: Array<keyof InfiniteQueryObserverResult>;
  /**
   * This callback will fire any time the query successfully fetches new data or the cache is updated via `setQueryData`.
   */
  onSuccess?: (data: TData) => void;
  /**
   * This callback will fire if the query encounters an error and will be passed the error.
   */
  onError?: (err: TError) => void;
  /**
   * This callback will fire any time the query is either successfully fetched or errors and be passed either the data or error.
   */
  onSettled?: (data: TData | undefined, error: TError | null) => void;
  /**
   * Whether errors should be thrown instead of setting the `error` property.
   * If set to `true` or `suspense` is `true`, all errors will be thrown to the error boundary.
   * If set to `false` and `suspense` is `false`, errors are returned as state.
   * If set to a function, it will be passed the error and should return a boolean indicating whether to show the error in an error boundary (`true`) or return the error as state (`false`).
   * Defaults to `false`.
   */
  useErrorBoundary?: MaybeRef<boolean> | ((error: TError) => boolean);
  /**
   * This option can be used to transform or select a part of the data returned by the query function.
   */
  select?: (data: TQueryData) => TData;
  /**
   * If set to `true`, the query will suspend when `status === 'loading'`
   * and throw errors when `status === 'error'`.
   * Defaults to `false`.
   */
  suspense?: MaybeRef<boolean>;
  /**
   * Set this to `true` to keep the previous `data` when fetching based on a new query key.
   * Defaults to `false`.
   */
  keepPreviousData?: MaybeRef<boolean>;
  /**
   * If set, this value will be used as the placeholder data for this particular query observer while the query is still in the `loading` data and no initialData has been provided.
   */
  placeholderData?: TQueryData | PlaceholderDataFunction<TQueryData>;
  /**
   * If set, the observer will optimistically set the result in fetching state before the query has actually started fetching.
   * This is to make sure the results are not lagging behind.
   * Defaults to `true`.
   */
  optimisticResults?: MaybeRef<boolean>;
}
