import {
  onUnmounted,
  reactive,
  watchEffect,
  readonly,
  ToRefs,
  toRefs,
} from "vue-demi";
import {
  MutateOptions,
  MutationObserver,
  MutationObserverResult,
} from "react-query/core";
import { MutationFunction, MutationKey } from "react-query/types/core";
import type {
  UseMutationOptions as UMO,
  UseMutateFunction,
  UseMutateAsyncFunction,
} from "react-query/types/react/types";
import { parseMutationArgs, updateState } from "./utils";
import { useQueryClient } from "./useQueryClient";
import { WithQueryClientKey } from "./types";

type MutationResult<TData, TError, TVariables, TContext> = Omit<
  MutationObserverResult<TData, TError, TVariables, TContext>,
  "mutate"
>;

export type UseMutationOptions<TData, TError, TVariables, TContext> =
  WithQueryClientKey<UMO<TData, TError, TVariables, TContext>>;

export type UseMutationReturnType<
  TData,
  TError,
  TVariables,
  TContext,
  Result = MutationResult<TData, TError, TVariables, TContext>
> = ToRefs<Readonly<Result>> & {
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>;
  mutateAsync: UseMutateAsyncFunction<TData, TError, TVariables, TContext>;
};

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  arg1:
    | MutationKey
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg2?:
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationReturnType<TData, TError, TVariables, TContext> {
  const options = parseMutationArgs(arg1, arg2, arg3);
  const queryClient = useQueryClient(options.queryClientKey);
  const observer = new MutationObserver(queryClient, options);

  const state = reactive(observer.getCurrentResult());

  const unsubscribe = observer.subscribe(() => {
    updateState(state, observer.getCurrentResult());
  });

  const mutate = (
    variables: TVariables,
    mutateOptions?: MutateOptions<TData, TError, TVariables, TContext>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observer.mutate(variables, mutateOptions).catch(() => {});
  };

  watchEffect(() => {
    observer.setOptions(options);
  });

  onUnmounted(() => {
    unsubscribe();
  });

  const resultRefs = toRefs(readonly(state)) as ToRefs<
    Readonly<MutationObserverResult<TData, TError, TVariables, TContext>>
  >;

  return {
    ...resultRefs,
    mutate,
    mutateAsync: state.mutate,
  };
}
