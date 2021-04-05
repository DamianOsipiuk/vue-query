import { onUnmounted } from "vue-demi";
import { QueryClient, setLogger } from "react-query/core";
import { useQuery } from "../src/useQuery";
import { useIsFetching } from "../src/useIsFetching";
import { flushPromises, simpleFetcher, noop } from "./utils";

jest.mock("vue", () => {
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

describe("useIsFetching", () => {
  beforeAll(() => {
    setLogger({ log: noop, warn: noop, error: noop });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should properly return isFetching state", async () => {
    const { isFetching: isFetchingQuery } = useQuery(
      "isFetching1",
      simpleFetcher
    );
    useQuery("isFetching2", simpleFetcher);
    const isFetching = useIsFetching();

    expect(isFetchingQuery.value).toStrictEqual(true);
    expect(isFetching.value).toStrictEqual(2);

    await flushPromises();

    expect(isFetchingQuery.value).toStrictEqual(false);
    expect(isFetching.value).toStrictEqual(0);
  });

  test("should stop listening to changes on onUnmount", async () => {
    const onUnmountedMock = onUnmounted as jest.MockedFunction<
      typeof onUnmounted
    >;
    onUnmountedMock.mockImplementation((fn) => fn());

    const { status } = useQuery("onUnmounted", simpleFetcher);
    const isFetching = useIsFetching();

    expect(status.value).toStrictEqual("loading");
    expect(isFetching.value).toStrictEqual(1);

    await flushPromises();

    expect(status.value).toStrictEqual("loading");
    expect(isFetching.value).toStrictEqual(1);

    await flushPromises();

    expect(status.value).toStrictEqual("loading");
    expect(isFetching.value).toStrictEqual(1);

    onUnmountedMock.mockReset();
  });
});
