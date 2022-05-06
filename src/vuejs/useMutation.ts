import {
  onScopeDispose,
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
import {
  MutationFunction,
  MutationKey,
  MutationObserverOptions,
  MutateFunction,
} from "react-query/lib/core";
import { parseMutationArgs, updateState } from "./utils";
import { useQueryClient } from "./useQueryClient";
import { WithQueryClientKey } from "./types";

type MutationResult<TData, TError, TVariables, TContext> = Omit<
  MutationObserverResult<TData, TError, TVariables, TContext>,
  "mutate"
>;

export type UseMutationOptions<TData, TError, TVariables, TContext> =
  WithQueryClientKey<
    MutationObserverOptions<TData, TError, TVariables, TContext>
  >;

type MutateSyncFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = (
  ...options: Parameters<MutateFunction<TData, TError, TVariables, TContext>>
) => void;

export type UseMutationReturnType<
  TData,
  TError,
  TVariables,
  TContext,
  Result = MutationResult<TData, TError, TVariables, TContext>
> = ToRefs<Readonly<Result>> & {
  mutate: MutateSyncFunction<TData, TError, TVariables, TContext>;
  mutateAsync: MutateFunction<TData, TError, TVariables, TContext>;
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
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  >
): UseMutationReturnType<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationKey"
  >
): UseMutationReturnType<TData, TError, TVariables, TContext>;
export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationKey" | "mutationFn"
  >
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
    observer.mutate(variables, mutateOptions).catch(() => {
      // This is intentional
    });
  };

  watchEffect(() => {
    observer.setOptions(options);
  });

  onScopeDispose(() => {
    unsubscribe();
  });

  const resultRefs = toRefs(readonly(state)) as unknown as ToRefs<
    Readonly<MutationResult<TData, TError, TVariables, TContext>>
  >;

  return {
    ...resultRefs,
    mutate,
    mutateAsync: state.mutate,
  };
}
