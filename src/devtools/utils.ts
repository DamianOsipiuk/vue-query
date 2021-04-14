import type { Query } from "react-query/types";

import type { Theme } from "./useTheme";

export enum Position {
  TR = "top-right",
  TL = "top-left",
  BR = "bottom-right",
  BL = "bottom-left",
}

export function getQueryStatusColor(query: Query, theme: Theme): string {
  return query.isFetching()
    ? theme.active
    : query.isStale()
    ? theme.warning
    : // @ts-expect-error Invalid types
    !query.observers.length
    ? theme.gray
    : theme.success;
}

export function getQueryStatusLabel(query: Query): string {
  return query.isFetching()
    ? "fetching"
    : // @ts-expect-error Invalid types
    !query.observers.length
    ? "inactive"
    : query.isStale()
    ? "stale"
    : "fresh";
}

export const getStatusRank = (query: Query): number =>
  query.state.isFetching
    ? 0
    : // @ts-expect-error Invalid types
    !query.observers.length
    ? 3
    : query.isStale()
    ? 2
    : 1;

export type SortFn = (a: Query, b: Query) => number;

const queryHashSort: SortFn = (a, b) => (a.queryHash > b.queryHash ? 1 : -1);

const dateSort: SortFn = (a, b) =>
  a.state.dataUpdatedAt < b.state.dataUpdatedAt ? 1 : -1;

const statusAndDateSort: SortFn = (a, b) =>
  getStatusRank(a) === getStatusRank(b)
    ? dateSort(a, b)
    : getStatusRank(a) > getStatusRank(b)
    ? 1
    : -1;

export const sortFns: Record<string, SortFn> = {
  "Status > Last Updated": statusAndDateSort,
  "Query Hash": queryHashSort,
  "Last Updated": dateSort,
};
