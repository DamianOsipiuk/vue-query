import { QueryCache as QC } from "react-query/core";
import type { Query, QueryKey } from "react-query/core";
import type { QueryFilters } from "react-query/types/core/utils";
import type { MaybeRef } from "./types";
import { cloneDeepUnref, isQueryKey } from "./utils";

export class QueryCache extends QC {
  constructor(config?: MaybeRef<QC["config"]>) {
    super(cloneDeepUnref(config));
  }

  find<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    arg1: MaybeRef<QueryKey>,
    arg2?: MaybeRef<QueryFilters>
  ): Query<TQueryFnData, TError, TData> | undefined {
    return super.find(cloneDeepUnref(arg1), cloneDeepUnref(arg2));
  }

  findAll(
    queryKey?: MaybeRef<QueryKey>,
    filters?: MaybeRef<QueryFilters>
  ): Query[];
  findAll(filters?: MaybeRef<QueryFilters>): Query[];
  findAll(
    arg1?: MaybeRef<QueryKey | QueryFilters>,
    arg2?: MaybeRef<QueryFilters>
  ): Query[];
  findAll(
    arg1?: MaybeRef<QueryKey | QueryFilters>,
    arg2?: MaybeRef<QueryFilters>
  ): Query[] {
    const arg1Unreffed = cloneDeepUnref(arg1);
    if (isQueryKey(arg1Unreffed)) {
      return super.findAll(arg1Unreffed, cloneDeepUnref(arg2));
    }
    return super.findAll(arg1Unreffed);
  }
}
