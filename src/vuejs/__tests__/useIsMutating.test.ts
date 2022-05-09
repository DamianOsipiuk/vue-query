import { onScopeDispose } from "vue-demi";

import { flushPromises, successMutator } from "./test-utils";
import { useMutation } from "../useMutation";
import { useIsMutating } from "../useIsMutating";
import { useQueryClient } from "../useQueryClient";

jest.mock("../useQueryClient");

describe("useIsMutating", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should properly return isMutating state", async () => {
    const mutation = useMutation((params: string) => successMutator(params));
    const mutation2 = useMutation((params: string) => successMutator(params));
    const isMutating = useIsMutating();

    expect(isMutating.value).toStrictEqual(0);

    mutation.mutateAsync("a");
    mutation2.mutateAsync("b");

    await flushPromises();

    expect(isMutating.value).toStrictEqual(2);

    await flushPromises();

    expect(isMutating.value).toStrictEqual(0);
  });

  test("should stop listening to changes on onScopeDispose", async () => {
    const onScopeDisposeMock = onScopeDispose as jest.MockedFunction<
      typeof onScopeDispose
    >;
    onScopeDisposeMock.mockImplementation((fn) => fn());

    const mutation = useMutation((params: string) => successMutator(params));
    const mutation2 = useMutation((params: string) => successMutator(params));
    const isMutating = useIsMutating();

    expect(isMutating.value).toStrictEqual(0);

    mutation.mutateAsync("a");
    mutation2.mutateAsync("b");

    await flushPromises();

    expect(isMutating.value).toStrictEqual(0);

    await flushPromises();

    expect(isMutating.value).toStrictEqual(0);

    onScopeDisposeMock.mockReset();
  });

  test("should call `useQueryClient` with a proper `queryClientKey`", async () => {
    const queryClientKey = "foo";
    useIsMutating({ queryClientKey });

    expect(useQueryClient).toHaveBeenCalledWith(queryClientKey);
  });
});
