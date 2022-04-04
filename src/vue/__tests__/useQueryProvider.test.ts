import { provide, onUnmounted } from "vue-demi";
import { QueryClient } from "../queryClient";

import { useQueryProvider } from "../useQueryProvider";
import { VUE_QUERY_CLIENT } from "../utils";

jest.mock("../queryClient", () => ({
  QueryClient: jest.fn(),
}));

describe("useQueryProvider", () => {
  const provideSpy = provide as jest.Mock;
  const onUnmountedSpy = onUnmounted as jest.Mock;
  const queryClientSpy = QueryClient as jest.Mock;

  const mount = jest.fn();
  const unmount = jest.fn();
  const queryClientInstance = {
    mount,
    unmount,
  };
  queryClientSpy.mockImplementation(() => queryClientInstance);

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("should create new queryClient instance", () => {
    useQueryProvider();

    expect(queryClientSpy).toHaveBeenCalledTimes(1);
  });

  test("should create queryClient with passed config", () => {
    const config = {
      defaultOptions: {
        queries: {
          enabled: false,
        },
      },
    };

    useQueryProvider(config);

    expect(queryClientSpy).toBeCalledWith(config);
  });

  test("should call mount on QueryClient", () => {
    useQueryProvider();

    expect(mount).toHaveBeenCalledTimes(1);
  });

  test("should call provide with QueryClient", () => {
    useQueryProvider();

    expect(provideSpy).toHaveBeenCalledTimes(1);
    expect(provideSpy).toHaveBeenCalledWith(
      VUE_QUERY_CLIENT,
      queryClientInstance
    );
  });

  test("should call provide with QueryClient and custom key suffix", () => {
    const queryClientKey = "foo";
    const expectedKeyParameter = `${VUE_QUERY_CLIENT}:${queryClientKey}`;
    useQueryProvider({}, queryClientKey);

    expect(provideSpy).toHaveBeenCalledTimes(1);
    expect(provideSpy).toHaveBeenCalledWith(
      expectedKeyParameter,
      queryClientInstance
    );
  });

  test("should call unmount on QueryClient", () => {
    onUnmountedSpy.mockImplementationOnce((fn) => fn());

    useQueryProvider();

    expect(unmount).toHaveBeenCalledTimes(1);
  });
});
