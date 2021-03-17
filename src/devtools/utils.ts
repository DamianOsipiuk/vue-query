import type { Query } from "react-query/types";

import type { Theme } from "./useTheme";

export enum Position {
  TR = "top-right",
  TL = "top-left",
  BR = "bottom-right",
  BL = "bottom-left",
}

export function isStale(query: Query): boolean {
  return typeof query.isStale === "function"
    ? query.isStale()
    : // @ts-expect-error Invalid types
      query.state.isStale;
}

export function getQueryStatusColor(query: Query, theme: Theme): string {
  return query.state.isFetching
    ? theme.active
    : isStale(query)
    ? theme.warning
    : // @ts-expect-error Invalid types
    !query.observers.length
    ? theme.gray
    : theme.success;
}

export function getQueryStatusLabel(query: Query): string {
  return query.state.isFetching
    ? "fetching"
    : // @ts-expect-error Invalid types
    !query.observers.length
    ? "inactive"
    : isStale(query)
    ? "stale"
    : "fresh";
}

export const getStatusRank = (query: Query): number =>
  query.state.isFetching
    ? 0
    : // @ts-expect-error Invalid types
    !query.observers.length
    ? 3
    : isStale(query)
    ? 2
    : 1;

export type SortFn = (a: Query, b: Query) => number;

export const sortFns: Record<string, SortFn> = {
  "Status > Last Updated": (a, b) =>
    getStatusRank(a) === getStatusRank(b)
      ? sortFns["Last Updated"](a, b)
      : getStatusRank(a) > getStatusRank(b)
      ? 1
      : -1,
  "Query Hash": (a, b) => (a.queryHash > b.queryHash ? 1 : -1),
  // @ts-expect-error Invalid types
  "Last Updated": (a, b) => (a.state.updatedAt < b.state.updatedAt ? 1 : -1),
};
