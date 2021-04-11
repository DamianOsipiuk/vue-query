import { computed, reactive, ref, onUnmounted } from "vue-demi";
import { QueryClient, QueryObserver, setLogger } from "react-query/core";
import { useQuery } from "../src/useQuery";
import { useBaseQuery } from "../src/useBaseQuery";
import { flushPromises, rejectFetcher, simpleFetcher, noop } from "./utils";

jest.mock("vue", () => {
  const vue = jest.requireActual("vue");
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

describe("useQuery", () => {
  beforeAll(() => {
    setLogger({ log: noop, warn: noop, error: noop });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should properly execute query with all three parameters", () => {
    useQuery("key0", simpleFetcher, { staleTime: 1000 });

    expect(useBaseQuery).toBeCalledWith(
      {
        queryFn: expect.anything(),
        queryKey: "key0",
        staleTime: 1000,
      },
      QueryObserver
    );
  });

  test("should properly execute query with queryKey and options", () => {
    useQuery("key01", { queryFn: simpleFetcher, staleTime: 1000 });

    expect(useBaseQuery).toBeCalledWith(
      {
        queryFn: expect.anything(),
        queryKey: "key01",
        staleTime: 1000,
      },
      QueryObserver
    );
  });

  test("should properly execute query with all three parameters", () => {
    useQuery({
      queryKey: "key02",
      queryFn: simpleFetcher,
      staleTime: 1000,
    });

    expect(useBaseQuery).toBeCalledWith(
      {
        queryFn: expect.anything(),
        queryKey: "key02",
        staleTime: 1000,
      },
      QueryObserver
    );
  });

  test("should return loading status initially", () => {
    const { status, isLoading, isFetching } = useQuery("key1", simpleFetcher);

    expect(status.value).toEqual("loading");
    expect(isLoading.value).toEqual(true);
    expect(isFetching.value).toEqual(true);
  });

  test("should be marked as stale initially", () => {
    const { isStale } = useQuery("key2", simpleFetcher);

    expect(isStale.value).toEqual(true);
  });

  test("should return false for other states initially", () => {
    const { isSuccess, isError, isIdle, isFetched } = useQuery(
      "key3",
      simpleFetcher
    );

    expect(isSuccess.value).toEqual(false);
    expect(isError.value).toEqual(false);
    expect(isIdle.value).toEqual(false);
    expect(isFetched.value).toEqual(false);
  });

  test("should resolve to success and update reactive state", async () => {
    const {
      status,
      data,
      isLoading,
      isFetched,
      isFetching,
      isSuccess,
    } = useQuery("key4", simpleFetcher);

    await flushPromises();

    expect(status.value).toEqual("success");
    expect(data.value).toEqual("Some data");
    expect(isLoading.value).toEqual(false);
    expect(isFetching.value).toEqual(false);
    expect(isFetched.value).toEqual(true);
    expect(isSuccess.value).toEqual(true);
  });

  test("should reject and update reactive state", async () => {
    const {
      status,
      data,
      error,
      isLoading,
      isFetched,
      isFetching,
      isError,
      failureCount,
    } = useQuery("key5", rejectFetcher, {
      retry: false,
    });

    await flushPromises();

    expect(status.value).toEqual("error");
    expect(data.value).toEqual(undefined);
    expect((error.value as Error).message).toEqual("Some error");
    expect(isLoading.value).toEqual(false);
    expect(isFetching.value).toEqual(false);
    expect(isFetched.value).toEqual(true);
    expect(isError.value).toEqual(true);
    expect(failureCount.value).toEqual(1);
  });

  test("should update query on reactive prop change", async () => {
    const spy = jest.fn();
    const onSuccess = ref(noop);
    useQuery(
      "key6",
      simpleFetcher,
      reactive({
        onSuccess,
        staleTime: 1000,
      })
    );

    onSuccess.value = spy;

    await flushPromises();

    expect(spy).toBeCalledTimes(1);
  });

  test("should properly execute dependant queries", async () => {
    const { data } = useQuery("dependant1", simpleFetcher);

    const enabled = computed(() => !!data.value);

    const { status } = useQuery(
      "dependant2",
      simpleFetcher,
      reactive({
        enabled,
      })
    );

    expect(data.value).toStrictEqual(undefined);
    expect(status.value).toStrictEqual("idle");

    await flushPromises();

    expect(data.value).toStrictEqual("Some data");
    expect(status.value).toStrictEqual("loading");

    await flushPromises();

    expect(status.value).toStrictEqual("success");
  });

  test("should stop listening to changes on onUnmount", async () => {
    const onUnmountedMock = onUnmounted as jest.MockedFunction<
      typeof onUnmounted
    >;
    onUnmountedMock.mockImplementationOnce((fn) => fn());

    const { status } = useQuery("onUnmounted", simpleFetcher);

    expect(status.value).toStrictEqual("loading");

    await flushPromises();

    expect(status.value).toStrictEqual("loading");

    await flushPromises();

    expect(status.value).toStrictEqual("loading");
  });
});
