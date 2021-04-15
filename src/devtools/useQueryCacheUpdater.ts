import { useQueryClient } from "../useQueryClient";

// Query from queryCache is not reactive so cannot use computed props
export const useQueryCacheUpdater = (
  queryHash: string,
  callback: () => void
): void => {
  callback();

  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  queryCache.subscribe((event) => {
    if (event?.query.queryHash === queryHash) {
      callback();
    }
  });
};
