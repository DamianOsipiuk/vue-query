import { inject } from "vue-demi";
import { useQueryClient, VUE_QUERY_CLIENT } from "../src/useQueryClient";

describe("useQueryClient", () => {
  const injectSpy = inject as jest.Mock;

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("should return queryClient when it is provided in the context", () => {
    const queryClientMock = { name: "Mocked client" };
    injectSpy.mockReturnValueOnce(queryClientMock);

    const queryClient = useQueryClient();

    expect(queryClient).toStrictEqual(queryClientMock);
    expect(injectSpy).toHaveBeenCalledTimes(1);
    expect(injectSpy).toHaveBeenCalledWith(VUE_QUERY_CLIENT);
  });

  test("should throw an error when queryClient does not exist in the context", () => {
    injectSpy.mockReturnValueOnce(undefined);

    expect(useQueryClient).toThrowError();
    expect(injectSpy).toHaveBeenCalledTimes(1);
    expect(injectSpy).toHaveBeenCalledWith(VUE_QUERY_CLIENT);
  });
});
