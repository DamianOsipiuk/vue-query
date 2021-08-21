/* istanbul ignore file */

export {
  QueryClient,
  QueryObserver,
  QueriesObserver,
  InfiniteQueryObserver,
  MutationObserver,
  QueryCache,
  MutationCache,
} from "react-query/core";

export { hydrate, dehydrate } from "./hydration";
export type {
  DehydrateOptions,
  DehydratedState,
  HydrateOptions,
} from "./hydration";

export * from "./vue";
