import { onUnmounted, Ref, ref } from "vue-demi";
import type { QueryKey } from "react-query/types/core";
import type { MutationFilters as MF } from "react-query/types/core/utils";

import { useQueryClient } from "./useQueryClient";
import { parseMutationFilterArgs } from "./utils";
import type { WithQueryClientKey } from "./types";

export type MutationFilters = WithQueryClientKey<MF>;

export function useIsMutating(filters?: MutationFilters): Ref<number>;
export function useIsMutating(
  queryKey?: QueryKey,
  filters?: MutationFilters
): Ref<number>;
export function useIsMutating(
  arg1?: QueryKey | MutationFilters,
  arg2?: MutationFilters
): Ref<number> {
  const filters = parseMutationFilterArgs(arg1, arg2);
  const queryClient = useQueryClient(filters?.queryClientKey);

  const isMutating = ref(queryClient.isMutating(filters));

  const unsubscribe = queryClient.getMutationCache().subscribe(() => {
    isMutating.value = queryClient.isMutating(filters);
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return isMutating;
}
