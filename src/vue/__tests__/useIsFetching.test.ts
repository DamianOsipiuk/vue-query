import { onScopeDispose } from "vue-demi";
import { setLogger } from "react-query/core";

import { flushPromises, simpleFetcher, noop } from "./test-utils";
import { useQuery } from "../useQuery";
import { useIsFetching } from "../useIsFetching";

jest.mock("../useQueryClient");

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

  test("should stop listening to changes on onScopeDispose", async () => {
    const onScopeDisposeMock = onScopeDispose as jest.MockedFunction<
      typeof onScopeDispose
    >;
    onScopeDisposeMock.mockImplementation((fn) => fn());

    const { status } = useQuery("onScopeDispose", simpleFetcher);
    const isFetching = useIsFetching();

    expect(status.value).toStrictEqual("loading");
    expect(isFetching.value).toStrictEqual(1);

    await flushPromises();

    expect(status.value).toStrictEqual("loading");
    expect(isFetching.value).toStrictEqual(1);

    await flushPromises();

    expect(status.value).toStrictEqual("loading");
    expect(isFetching.value).toStrictEqual(1);

    onScopeDisposeMock.mockReset();
  });
});
