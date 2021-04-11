import { inject } from "vue-demi";
import { useQueryClient, VUE_REACT_QUERY_CLIENT } from "../src/useQueryClient";

jest.mock("vue-demi", () => {
  const vue = jest.requireActual("vue-demi");
  return {
    ...vue,
    inject: jest.fn(),
  };
});

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
    expect(injectSpy).toHaveBeenCalledWith(VUE_REACT_QUERY_CLIENT);
  });

  test("should throw an error when queryClient does not exist in the context", () => {
    injectSpy.mockReturnValueOnce(undefined);

    expect(useQueryClient).toThrowError(
      Error(
        "No queryClient found in Vue context, use 'app.provide(VUE_REACT_QUERY_CLIENT, new QueryClient());' to set one in root component."
      )
    );
    expect(injectSpy).toHaveBeenCalledTimes(1);
    expect(injectSpy).toHaveBeenCalledWith(VUE_REACT_QUERY_CLIENT);
  });
});
