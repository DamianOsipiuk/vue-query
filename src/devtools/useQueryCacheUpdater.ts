import { useQueryClient } from "../useQueryClient";

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
