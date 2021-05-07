import { onUnmounted } from "vue-demi";
import { QueryClient, setLogger } from "react-query/core";
import { useMutation } from "../src/useMutation";
import { useIsMutating } from "../src/useIsMutating";
import { flushPromises, noop, successMutator } from "./test-utils";

jest.mock("vue-demi", () => {
  const vue = jest.requireActual("vue-demi");
  return {
    ...vue,
    onUnmounted: jest.fn(),
  };
});

jest.mock("../src/useQueryClient", () => {
  const queryClient = new QueryClient();
  return {
    useQueryClient: jest.fn(() => queryClient),
  };
});

jest.mock("../src/useBaseQuery", () => {
  const { useBaseQuery: originImpl } = jest.requireActual(
    "../src/useBaseQuery"
  );
  return {
    useBaseQuery: jest.fn(originImpl),
  };
});

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
});
