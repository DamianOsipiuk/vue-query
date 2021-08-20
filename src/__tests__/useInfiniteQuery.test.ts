import { setLogger } from "react-query/core";
import { useInfiniteQuery } from "../useInfiniteQuery";
import { noop, infiniteFetcher, flushPromises } from "../test-utils";

jest.mock("../useQueryClient");

describe("useQuery", () => {
  beforeAll(() => {
    setLogger({ log: noop, warn: noop, error: noop });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should properly execute infinite query", async () => {
    const { data, fetchNextPage, status } = useInfiniteQuery(
      "infiniteQuery",
      infiniteFetcher
    );

    expect(data.value).toStrictEqual(undefined);
    expect(status.value).toStrictEqual("loading");

    await flushPromises();

    expect(data.value).toStrictEqual({
      pageParams: [undefined],
      pages: ["data on page 0"],
    });
    expect(status.value).toStrictEqual("success");

    fetchNextPage.value({ pageParam: 12 });

    await flushPromises();

    expect(data.value).toStrictEqual({
      pageParams: [undefined, 12],
      pages: ["data on page 0", "data on page 12"],
    });
    expect(status.value).toStrictEqual("success");
  });
});
