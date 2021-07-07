import { onUnmounted, reactive, set } from "vue-demi";
import { setLogger } from "react-query/core";
import { useQueries } from "../src/useQueries";
import {
  flushPromises,
  rejectFetcher,
  simpleFetcher,
  noop,
} from "./test-utils";

jest.mock("../src/useQueryClient");

describe("useQueries", () => {
  beforeAll(() => {
    setLogger({ log: noop, warn: noop, error: noop });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return result for each query", () => {
    const queries = [
      {
        queryKey: "key1",
        queryFn: simpleFetcher,
      },
      {
        queryKey: "key2",
        queryFn: simpleFetcher,
      },
    ];
    const queriesState = useQueries(queries);

    expect(queriesState).toMatchObject([
      {
        status: "loading",
        isLoading: true,
        isFetching: true,
        isStale: true,
      },
      {
        status: "loading",
        isLoading: true,
        isFetching: true,
        isStale: true,
      },
    ]);
  });

  test("should resolve to success and update reactive state", async () => {
    const queries = [
      {
        queryKey: "key11",
        queryFn: simpleFetcher,
      },
      {
        queryKey: "key12",
        queryFn: simpleFetcher,
      },
    ];
    const queriesState = useQueries(queries);

    await flushPromises();

    expect(queriesState).toMatchObject([
      {
        status: "success",
        isLoading: false,
        isFetching: false,
        isStale: true,
      },
      {
        status: "success",
        isLoading: false,
        isFetching: false,
        isStale: true,
      },
    ]);
  });

  test("should reject one of the queries and update reactive state", async () => {
    const queries = [
      {
        queryKey: "key21",
        queryFn: rejectFetcher,
        retry: false,
      },
      {
        queryKey: "key22",
        queryFn: simpleFetcher,
      },
    ];
    const queriesState = useQueries(queries);

    await flushPromises();

    expect(queriesState).toMatchObject([
      {
        status: "error",
        isLoading: false,
        isFetching: false,
        isStale: true,
      },
      {
        status: "success",
        isLoading: false,
        isFetching: false,
        isStale: true,
      },
    ]);
  });

  test("should return state for new queries", async () => {
    const initialQueries = reactive([]);
    const queries = [
      {
        queryKey: "key31",
        queryFn: simpleFetcher,
      },
      {
        queryKey: "key32",
        queryFn: simpleFetcher,
      },
    ];
    const queriesState = useQueries(initialQueries);

    expect(queriesState.length).toEqual(0);

    queries.forEach((query, index) => {
      set(initialQueries, index, query);
    });

    await flushPromises();
    await flushPromises();

    expect(queriesState.length).toEqual(2);

    expect(queriesState).toMatchObject([
      {
        status: "success",
        isLoading: false,
        isFetching: false,
        isStale: true,
      },
      {
        status: "success",
        isLoading: false,
        isFetching: false,
        isStale: true,
      },
    ]);
  });

  test("should stop listening to changes on onUnmount", async () => {
    const onUnmountedMock = onUnmounted as jest.MockedFunction<
      typeof onUnmounted
    >;
    onUnmountedMock.mockImplementationOnce((fn) => fn());

    const queries = [
      {
        queryKey: "key41",
        queryFn: simpleFetcher,
      },
      {
        queryKey: "key42",
        queryFn: simpleFetcher,
      },
    ];
    const queriesState = useQueries(queries);

    await flushPromises();

    expect(queriesState).toMatchObject([
      {
        status: "loading",
        isLoading: true,
        isFetching: true,
        isStale: true,
      },
      {
        status: "loading",
        isLoading: true,
        isFetching: true,
        isStale: true,
      },
    ]);
  });
});
