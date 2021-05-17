/* istanbul ignore file */

export {
  QueryClient,
  QueryObserver,
  QueriesObserver,
  InfiniteQueryObserver,
  MutationObserver,
} from "react-query/core";

export { useQueryClient, VUE_QUERY_CLIENT } from "./useQueryClient";
export { useQueryProvider } from "./useQueryProvider";

export { useQuery } from "./useQuery";
export { useQueries } from "./useQueries";
export { useInfiniteQuery } from "./useInfiniteQuery";
export { useMutation } from "./useMutation";
export { useIsFetching } from "./useIsFetching";
export { useIsMutating } from "./useIsMutating";
