import * as vue from "vue";
import { useQueryClient, VUE_REACT_QUERY_CLIENT } from "../src/useQueryClient";

describe("useQueryClient", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("should return queryClient when it is provided in the context", () => {
    const queryClientMock = { name: "Mocked client" };
    const injectSpy = jest
      .spyOn(vue, "inject")
      .mockReturnValue(queryClientMock);

    const queryClient = useQueryClient();

    expect(queryClient).toStrictEqual(queryClientMock);
    expect(injectSpy).toHaveBeenCalledTimes(1);
    expect(injectSpy).toHaveBeenCalledWith(VUE_REACT_QUERY_CLIENT);
  });

  test("should throw an error when queryClient does not exist in the context", () => {
    const injectSpy = jest.spyOn(vue, "inject").mockReturnValue(undefined);

    expect(useQueryClient).toThrowError(
      Error(
        "No queryClient found in Vue context, use 'app.provide(VUE_REACT_QUERY_CLIENT, new QueryClient());' to set one in root component."
      )
    );
    expect(injectSpy).toHaveBeenCalledTimes(1);
    expect(injectSpy).toHaveBeenCalledWith(VUE_REACT_QUERY_CLIENT);
  });
});
