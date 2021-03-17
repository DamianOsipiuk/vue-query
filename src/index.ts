export { QueryClient } from "react-query/core";

export { useQueryClient, VUE_REACT_QUERY_CLIENT } from "./useQueryClient";

export { useQuery } from "./useQuery";
export { useQueries } from "./useQueries";
export { useInfiniteQuery } from "./useInfiniteQuery";
export { useMutation } from "./useMutation";
export { useIsFetching } from "./useIsFetching";

export {
  VueQueryDevTools,
  VueQueryDevToolsPanel,
  VUE_QUERY_DEVTOOLS_THEME,
} from "./devtools";
export type { Theme } from "./devtools";
