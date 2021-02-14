import { onUnmounted, reactive, ref, watchEffect } from "vue";
import { parseMutationArgs } from "react-query/types/core/utils";
import { MutateOptions, MutationObserver } from "react-query/core";
import {
  UseMutationOptions,
  UseMutationResult,
  MutationFunction,
  MutationKey,
} from "react-query/types";
import { useQueryClient } from "./useQueryClient";

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>;
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
): UseMutationResult<TData, TError, TVariables, TContext> {
  const forceUpdate = ref(0);

  const options = parseMutationArgs(arg1, arg2, arg3);
  const queryClient = useQueryClient();
  const observer = new MutationObserver(queryClient, options);

  const state = reactive(observer.getCurrentResult());

  const unsubscribe = observer.subscribe(() => {
    forceUpdate.value = forceUpdate.value + 1;
  });

  const mutate = (
    variables: TVariables,
    mutateOptions: MutateOptions<TData, TError, TVariables, TContext>
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observer.mutate(variables, mutateOptions).catch(() => {});
  };

  if (state.error && observer.options.useErrorBoundary) {
    throw state.error;
  }

  watchEffect(() => {
    observer.setOptions(options);
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return { ...state, mutate, mutateAsync: state.mutate } as UseMutationResult<
    TData,
    TError,
    TVariables,
    TContext
  >;
}
