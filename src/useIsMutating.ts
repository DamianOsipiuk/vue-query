import { onUnmounted, Ref, ref } from "vue-demi";
import { MutationFilters } from "react-query/types/core/utils";
import { useQueryClient } from "./useQueryClient";

export function useIsMutating(filters?: MutationFilters): Ref<number> {
  const queryClient = useQueryClient();

  const isMutating = ref(queryClient.isMutating(filters));

  const unsubscribe = queryClient.getMutationCache().subscribe(() => {
    isMutating.value = queryClient.isMutating(filters);
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return isMutating;
}
