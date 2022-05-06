import { onScopeDispose, Ref, ref } from "vue-demi";
import type { MutationKey } from "react-query/lib/core";
import type { MutationFilters as MF } from "react-query/lib/core/utils";

import { useQueryClient } from "./useQueryClient";
import { parseMutationFilterArgs } from "./utils";
import type { WithQueryClientKey } from "./types";

export type MutationFilters = WithQueryClientKey<MF>;

export function useIsMutating(filters?: MutationFilters): Ref<number>;
export function useIsMutating(
  mutationKey?: MutationKey,
  filters?: Omit<MutationFilters, "mutationKey">
): Ref<number>;
export function useIsMutating(
  arg1?: MutationKey | MutationFilters,
  arg2?: Omit<MutationFilters, "mutationKey">
): Ref<number> {
  const filters = parseMutationFilterArgs(arg1, arg2);
  const queryClient = useQueryClient(filters?.queryClientKey);

  const isMutating = ref(queryClient.isMutating(filters));

  const unsubscribe = queryClient.getMutationCache().subscribe(() => {
    isMutating.value = queryClient.isMutating(filters);
  });

  onScopeDispose(() => {
    unsubscribe();
  });

  return isMutating;
}
