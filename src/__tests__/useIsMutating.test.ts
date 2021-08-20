import { onUnmounted } from "vue-demi";
import { setLogger } from "react-query/core";
import { useMutation } from "../useMutation";
import { useIsMutating } from "../useIsMutating";
import { flushPromises, noop, successMutator } from "../test-utils";
import { useQueryClient } from "../useQueryClient";

jest.mock("../useQueryClient");

describe("useIsMutating", () => {
  beforeAll(() => {
    setLogger({ log: noop, warn: noop, error: noop });
  });

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

  test("should stop listening to changes on onUnmount", async () => {
    const onUnmountedMock = onUnmounted as jest.MockedFunction<
      typeof onUnmounted
    >;
    onUnmountedMock.mockImplementation((fn) => fn());

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

    onUnmountedMock.mockReset();
  });

  test("should call `useQueryClient` with a proper `queryClientKey`", async () => {
    const queryClientKey = "foo";
    useIsMutating({ queryClientKey });

    expect(useQueryClient).toHaveBeenCalledWith(queryClientKey);
  });
});
