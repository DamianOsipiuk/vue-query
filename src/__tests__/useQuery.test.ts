import {
  computed,
  reactive,
  ref,
  onUnmounted,
  getCurrentInstance,
} from "vue-demi";
import { QueryObserver, setLogger } from "react-query/core";
import { useQuery } from "../useQuery";
import { useBaseQuery } from "../useBaseQuery";
import {
  flushPromises,
  rejectFetcher,
  simpleFetcher,
  noop,
} from "../test-utils";

jest.mock("../useQueryClient");
jest.mock("../useBaseQuery");

describe("useQuery", () => {
  beforeAll(() => {
    setLogger({ log: noop, warn: noop, error: noop });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should properly execute query", () => {
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

  test("should return loading status initially", () => {
    const query = useQuery("key1", simpleFetcher);

    expect(query).toMatchObject({
      status: { value: "loading" },
      isLoading: { value: true },
      isFetching: { value: true },
      isStale: { value: true },
    });
  });

  test("should resolve to success and update reactive state", async () => {
    const query = useQuery("key2", simpleFetcher);

    await flushPromises();

    expect(query).toMatchObject({
      status: { value: "success" },
      data: { value: "Some data" },
      isLoading: { value: false },
      isFetching: { value: false },
      isFetched: { value: true },
      isSuccess: { value: true },
    });
  });

  test("should reject and update reactive state", async () => {
    const query = useQuery("key3", rejectFetcher, {
      retry: false,
    });

    await flushPromises();

    expect(query).toMatchObject({
      status: { value: "error" },
      data: { value: undefined },
      error: { value: { message: "Some error" } },
      isLoading: { value: false },
      isFetching: { value: false },
      isFetched: { value: true },
      isError: { value: true },
      failureCount: { value: 1 },
    });
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

  describe("suspense", () => {
    test("should return undefined by default", () => {
      const query = useQuery("suspense1", simpleFetcher);
      const result = query.suspense();

      expect(result).toEqual(undefined);
    });

    test("should return undefined when not used in a vue component", () => {
      const getCurrentInstanceSpy = getCurrentInstance as jest.Mock;
      getCurrentInstanceSpy.mockImplementation(() => null);

      const query = useQuery("suspense2", simpleFetcher);
      const result = query.suspense();

      expect(result).toEqual(undefined);
    });

    test("should return a Promise when inside a Suspense boundary", () => {
      const getCurrentInstanceSpy = getCurrentInstance as jest.Mock;
      getCurrentInstanceSpy.mockImplementation(() => ({ suspense: {} }));

      const query = useQuery("suspense3", simpleFetcher);
      const result = query.suspense();

      expect(result).toBeInstanceOf(Promise);
    });
  });
});
