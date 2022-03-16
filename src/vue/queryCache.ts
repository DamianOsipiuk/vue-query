import { QueryCache as QC } from "react-query/core";
import type { Query, QueryKey } from "react-query/core";
import type { QueryFilters } from "react-query/types/core/utils";
import type { MaybeRefDeep } from "./types";
import { cloneDeepUnref, isQueryKey } from "./utils";

export class QueryCache extends QC {
  find<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    arg1: MaybeRefDeep<QueryKey>,
    arg2?: MaybeRefDeep<QueryFilters>
  ): Query<TQueryFnData, TError, TData> | undefined {
    return super.find(cloneDeepUnref(arg1), cloneDeepUnref(arg2));
  }

  findAll(
    queryKey?: MaybeRefDeep<QueryKey>,
    filters?: MaybeRefDeep<QueryFilters>
  ): Query[];
  findAll(filters?: MaybeRefDeep<QueryFilters>): Query[];
  findAll(
    arg1?: MaybeRefDeep<QueryKey | QueryFilters>,
    arg2?: MaybeRefDeep<QueryFilters>
  ): Query[];
  findAll(
    arg1?: MaybeRefDeep<QueryKey | QueryFilters>,
    arg2?: MaybeRefDeep<QueryFilters>
  ): Query[] {
    const arg1Unreffed = cloneDeepUnref(arg1);
    if (isQueryKey(arg1Unreffed)) {
      return super.findAll(arg1Unreffed, cloneDeepUnref(arg2));
    }
    return super.findAll(arg1Unreffed);
  }
}
