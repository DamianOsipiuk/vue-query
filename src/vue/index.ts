/* istanbul ignore file */

export { useQueryClient, VUE_QUERY_CLIENT } from "./useQueryClient";
export { useQueryProvider } from "./useQueryProvider";
export { VueQueryPlugin } from "./vueQueryPlugin";

export { useQuery } from "./useQuery";
export { useQueries } from "./useQueries";
export { useInfiniteQuery } from "./useInfiniteQuery";
export { useMutation } from "./useMutation";
export { useIsFetching } from "./useIsFetching";
export { useIsMutating } from "./useIsMutating";
export {
  parseFilterArgs,
  parseMutationArgs,
  parseQueryArgs,
  parseMutationFilterArgs,
} from "./utils";

export type { UseQueryReturnType } from "./useBaseQuery";
export type { UseQueryOptions } from "./useQuery";
export type { UseInfiniteQueryOptions } from "./useInfiniteQuery";
export type { UseMutationOptions, UseMutationReturnType } from "./useMutation";
export type { UseQueriesOptions, UseQueriesResults } from "./useQueries";
export type { MutationFilters } from "./useIsMutating";
export type { QueryFilters } from "./useIsFetching";
export type { VueQueryPluginOptions } from "./vueQueryPlugin";
