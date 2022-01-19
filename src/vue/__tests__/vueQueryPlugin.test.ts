// import { successMutator, simpleFetcher } from "./test-utils";
import { QueryClient } from "react-query/types/core";
import { VueQueryPlugin } from "../vueQueryPlugin";
import { VUE_QUERY_CLIENT } from "../useQueryClient";

const vue3AppMock = {
  provide: jest.fn(),
};

describe("VueQueryPlugin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when called without additional options", () => {
    test("should instantiate a client with default clientKey", () => {
      VueQueryPlugin(vue3AppMock);

      expect(vue3AppMock.provide).toHaveBeenCalledWith(
        VUE_QUERY_CLIENT,
        expect.objectContaining({ defaultOptions: {} })
      );
    });
  });

  describe("when called with custom clientKey", () => {
    test("should instantiate a client with customized clientKey", () => {
      VueQueryPlugin(vue3AppMock, { queryClientKey: "CUSTOM" });

      expect(vue3AppMock.provide).toHaveBeenCalledWith(
        VUE_QUERY_CLIENT + "CUSTOM",
        expect.objectContaining({ defaultOptions: {} })
      );
    });
  });

  describe("when called with custom client", () => {
    test("should instantiate that custom client", () => {
      const customClient = { mount: jest.fn() } as unknown as QueryClient;
      VueQueryPlugin(vue3AppMock, { queryClient: customClient });

      expect(customClient.mount).toHaveBeenCalled();
      expect(vue3AppMock.provide).toHaveBeenCalledWith(
        VUE_QUERY_CLIENT,
        customClient
      );
    });
  });

  describe("when called with custom client condig", () => {
    test("should instantiate a client with the provided config", () => {
      VueQueryPlugin(vue3AppMock, {
        queryClientConfig: {
          defaultOptions: { queries: { enabled: true } },
        },
      });

      expect(vue3AppMock.provide).toHaveBeenCalledWith(
        VUE_QUERY_CLIENT,
        expect.objectContaining({
          defaultOptions: { queries: { enabled: true } },
        })
      );
    });
  });
});
