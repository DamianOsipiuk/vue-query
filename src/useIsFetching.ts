import { onUnmounted, Ref, ref, watchEffect } from "vue-demi";
import { QueryKey } from "react-query/types";
import { QueryFilters } from "react-query/types/core/utils";
import { useQueryClient } from "./useQueryClient";
import { parseFilterArgs } from "./utils";

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
  const queryClient = useQueryClient();

  const [parsedFilters] = parseFilterArgs(arg1, arg2);
  filters.value = parsedFilters;

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
