import { MutationCache as MC } from "react-query/core";
import type { Mutation } from "react-query/core";
import type { MutationFilters } from "react-query/types/core/utils";
import type { MaybeRefDeep } from "./types";
import { cloneDeepUnref } from "./utils";

export class MutationCache extends MC {
  find<TData = unknown, TError = unknown, TVariables = any, TContext = unknown>(
    filters: MaybeRefDeep<MutationFilters>
  ): Mutation<TData, TError, TVariables, TContext> | undefined {
    return super.find(cloneDeepUnref(filters) as MutationFilters);
  }

  findAll(filters: MaybeRefDeep<MutationFilters>): Mutation[] {
    return super.findAll(cloneDeepUnref(filters) as MutationFilters);
  }
}
