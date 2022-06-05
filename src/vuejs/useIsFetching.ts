import { onScopeDispose, Ref, ref, watch } from "vue-demi";
import type { QueryKey } from "react-query/lib/core";
import type { QueryFilters as QF } from "react-query/lib/core/utils";

import { useQueryClient } from "./useQueryClient";
import { cloneDeepUnref, isQueryKey } from "./utils";
import type { MaybeRefDeep, WithQueryClientKey } from "./types";

export type QueryFilters = MaybeRefDeep<WithQueryClientKey<QF>>;

export function useIsFetching(filters?: QueryFilters): Ref<number>;
export function useIsFetching(
  queryKey?: QueryKey,
  filters?: QueryFilters
): Ref<number>;
export function useIsFetching(
  arg1?: QueryKey | QueryFilters,
  arg2?: QueryFilters
): Ref<number> {
  const filters = ref(parseFilterArgs(arg1, arg2));
  const queryClient = useQueryClient(filters.value.queryClientKey);

  const isFetching = ref(queryClient.isFetching(filters));

  const unsubscribe = queryClient.getQueryCache().subscribe(() => {
    isFetching.value = queryClient.isFetching(filters);
  });

  watch(
    [() => arg1, () => arg2],
    () => {
      filters.value = parseFilterArgs(arg1, arg2);
      isFetching.value = queryClient.isFetching(filters);
    },
    { deep: true }
  );

  onScopeDispose(() => {
    unsubscribe();
  });

  return isFetching;
}

export function parseFilterArgs(
  arg1?: QueryKey | QueryFilters,
  arg2: QueryFilters = {}
) {
  let options: QueryFilters;

  if (isQueryKey(arg1)) {
    options = { ...arg2, queryKey: arg1 };
  } else {
    options = arg1 || {};
  }

  return cloneDeepUnref(options) as WithQueryClientKey<QF>;
}
