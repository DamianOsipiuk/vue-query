import { MutationCache as MC } from "react-query/core";
import type { Mutation } from "react-query/core";
import type { MutationFilters } from "react-query/types/core/utils";
import type { MaybeRef } from "./types";
import { cloneDeepUnref } from "./utils";

export class MutationCache extends MC {
  constructor(config?: MaybeRef<MC["config"]>) {
    super(cloneDeepUnref(config));
  }

  find<TData = unknown, TError = unknown, TVariables = any, TContext = unknown>(
    filters: MaybeRef<MutationFilters>
  ): Mutation<TData, TError, TVariables, TContext> | undefined {
    return super.find(cloneDeepUnref(filters));
  }

  findAll(filters: MaybeRef<MutationFilters>): Mutation[] {
    return super.findAll(cloneDeepUnref(filters));
  }
}
