import type { Query } from "react-query/types";

import type { SortFn } from "./types";
import type { Theme } from "./useTheme";

export enum Position {
  TR = "top-right",
  TL = "top-left",
  BR = "bottom-right",
  BL = "bottom-left",
}

export enum QueryState {
  Fetching = 0,
  Fresh,
  Stale,
  Inactive,
}

export const QueryStateLabel = {
  [QueryState.Fetching]: "fetching",
  [QueryState.Fresh]: "fresh",
  [QueryState.Stale]: "stale",
  [QueryState.Inactive]: "inactive",
};

export function getQueryState(query: Query): QueryState {
  if (query.isFetching()) {
    return QueryState.Fetching;
  }
  if (!query.getObserversCount()) {
    return QueryState.Inactive;
  }
  if (query.isStale()) {
    return QueryState.Stale;
  }

  return QueryState.Fresh;
}

export function getQueryStatusColor(query: Query, theme: Theme): string {
  const queryState = getQueryState(query);

  if (queryState === QueryState.Fetching) {
    return theme.active;
  }
  if (queryState === QueryState.Stale) {
    return theme.warning;
  }
  if (queryState === QueryState.Inactive) {
    return theme.gray;
  }

  return theme.success;
}

export function getQueryStatusLabel(query: Query): string {
  return QueryStateLabel[getQueryState(query)];
}

export const getStatusRank = (query: Query): number => {
  return getQueryState(query);
};

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

export function makeArrayNonConfigurable(objects: Query[]): void {
  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      Object.defineProperty(obj, key, { configurable: false });
    });
  });
}
