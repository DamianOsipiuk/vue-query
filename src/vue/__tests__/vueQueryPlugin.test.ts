// import { QueryClient } from "react-query/types/core";
// import { VueQueryPlugin } from "../vueQueryPlugin";
// import { VUE_QUERY_CLIENT } from "../useQueryClient";
// import { App } from "vue-demi";

// const appMock = {
//   provide: jest.fn(),
// } as unknown as App;

describe("VueQueryPlugin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("todo", () => {
    expect(true).toBe(true);
  });

  // describe("when called without additional options", () => {
  //   test("should instantiate a client with default clientKey", () => {
  //     VueQueryPlugin.install(appMock);

  //     expect(appMock.provide).toHaveBeenCalledWith(
  //       VUE_QUERY_CLIENT,
  //       expect.objectContaining({ defaultOptions: {} })
  //     );
  //   });
  // });

  // describe("when called with custom clientKey", () => {
  //   test("should instantiate a client with customized clientKey", () => {
  //     VueQueryPlugin.install(appMock, { queryClientKey: "CUSTOM" });

  //     expect(appMock.provide).toHaveBeenCalledWith(
  //       VUE_QUERY_CLIENT + "CUSTOM",
  //       expect.objectContaining({ defaultOptions: {} })
  //     );
  //   });
  // });

  // describe("when called with custom client", () => {
  //   test("should instantiate that custom client", () => {
  //     const customClient = { mount: jest.fn() } as unknown as QueryClient;
  //     VueQueryPlugin.install(appMock, { queryClient: customClient });

  //     expect(customClient.mount).toHaveBeenCalled();
  //     expect(appMock.provide).toHaveBeenCalledWith(
  //       VUE_QUERY_CLIENT,
  //       customClient
  //     );
  //   });
  // });

  // describe("when called with custom client condig", () => {
  //   test("should instantiate a client with the provided config", () => {
  //     VueQueryPlugin.install(appMock, {
  //       queryClientConfig: {
  //         defaultOptions: { queries: { enabled: true } },
  //       },
  //     });

  //     expect(appMock.provide).toHaveBeenCalledWith(
  //       VUE_QUERY_CLIENT,
  //       expect.objectContaining({
  //         defaultOptions: { queries: { enabled: true } },
  //       })
  //     );
  //   });
  // });
});
