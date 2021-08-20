import { onUnmounted, Ref, ref } from "vue-demi";
import type { MutationFilters as MF } from "react-query/types/core/utils";

import { useQueryClient } from "./useQueryClient";
import type { WithQueryClientKey } from "./types";

export type MutationFilters = WithQueryClientKey<MF>;

export function useIsMutating(filters?: MutationFilters): Ref<number> {
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
