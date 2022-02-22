import { QueryCache as QC } from "react-query/core";
import type { Query, QueryKey } from "react-query/core";
import type { QueryFilters } from "react-query/types/core/utils";
import type { MaybeRef, MaybeRefParams } from "./types";
import { cloneDeepUnref } from "./utils";

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

  findAll: MaybeRefParams<QC["findAll"]> = (arg1, arg2) => {
    return super.findAll(cloneDeepUnref(arg1), cloneDeepUnref(arg2));
  };
}
