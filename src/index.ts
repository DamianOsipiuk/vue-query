/* istanbul ignore file */

export * from "@tanstack/query-core";

export { useQueryClient } from "./vuejs/useQueryClient";
export { VueQueryPlugin } from "./vuejs/vueQueryPlugin";

export { QueryClient } from "./vuejs/queryClient";
export { QueryCache } from "./vuejs/queryCache";
export { MutationCache } from "./vuejs/mutationCache";
export { useQuery } from "./vuejs/useQuery";
export { useQueries } from "./vuejs/useQueries";
export { useInfiniteQuery } from "./vuejs/useInfiniteQuery";
export { useMutation } from "./vuejs/useMutation";
export { useIsFetching } from "./vuejs/useIsFetching";
export { useIsMutating } from "./vuejs/useIsMutating";
export { VUE_QUERY_CLIENT } from "./vuejs/utils";

export type { UseQueryReturnType } from "./vuejs/useBaseQuery";
export type { UseQueryOptions } from "./vuejs/useQuery";
export type { UseInfiniteQueryOptions } from "./vuejs/useInfiniteQuery";
export type {
  UseMutationOptions,
  UseMutationReturnType,
} from "./vuejs/useMutation";
export type { UseQueriesOptions, UseQueriesResults } from "./vuejs/useQueries";
export type { MutationFilters } from "./vuejs/useIsMutating";
export type { QueryFilters } from "./vuejs/useIsFetching";
export type { VueQueryPluginOptions } from "./vuejs/vueQueryPlugin";
