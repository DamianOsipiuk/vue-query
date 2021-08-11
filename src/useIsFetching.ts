import { onUnmounted, Ref, ref, watchEffect } from "vue-demi";
import type { QueryKey } from "react-query/types/core";
import type { QueryFilters as QF } from "react-query/types/core/utils";

import { useQueryClient } from "./useQueryClient";
import { parseFilterArgs } from "./utils";
import type { WithQueryClientKey } from "./types";

export type QueryFilters = WithQueryClientKey<QF>;

export function useIsFetching(filters?: QueryFilters): Ref<number>;
export function useIsFetching(
  queryKey?: QueryKey,
  filters?: QueryFilters
): Ref<number>;
export function useIsFetching(
  arg1?: QueryKey | QueryFilters,
  arg2?: QueryFilters
): Ref<number> {
  const filters: Ref<QueryFilters> = ref({});
  const [parsedFilters] = parseFilterArgs(arg1, arg2);
  filters.value = parsedFilters;

  const queryClient = useQueryClient(parsedFilters?.queryClientKey);

  const isFetching = ref(queryClient.isFetching(filters.value));

  const unsubscribe = queryClient.getQueryCache().subscribe(() => {
    isFetching.value = queryClient.isFetching(filters.value);
  });

  watchEffect(() => {
    const [parsedFilters] = parseFilterArgs(arg1, arg2);
    filters.value = parsedFilters;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return isFetching;
}
