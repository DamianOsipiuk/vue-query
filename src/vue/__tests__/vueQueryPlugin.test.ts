import { App, ComponentOptions } from "vue";
import { isVue2, isVue3 } from "vue-demi";
import { QueryClient } from "react-query/types/core";

import { VueQueryPlugin } from "../vueQueryPlugin";
import { VUE_QUERY_CLIENT } from "../utils";
import { setupDevtools } from "../devtools/devtools";

jest.mock("../devtools/devtools");

interface TestApp extends App {
  onUnmount: Function;
  _unmount: Function;
  _mixin: ComponentOptions;
  _provided: Record<string, any>;
}

const testIf = (condition: boolean) => (condition ? test : test.skip);

function getAppMock(withUnmountHook = false): TestApp {
  const mock = {
    provide: jest.fn(),
    unmount: jest.fn(),
    onUnmount: withUnmountHook
      ? jest.fn((u: Function) => {
          mock._unmount = u;
        })
      : undefined,
    mixin: (m: ComponentOptions): any => {
      mock._mixin = m;
    },
  } as unknown as TestApp;

  return mock;
}

describe("VueQueryPlugin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("devtools", () => {
    test("should NOT setup devtools", () => {
      const setupDevtoolsMock = setupDevtools as jest.Mock;
      const appMock = getAppMock();
      VueQueryPlugin.install?.(appMock);

      expect(setupDevtoolsMock).toHaveBeenCalledTimes(0);
    });

    test("should setup devtools", () => {
      // @ts-ignore
      global.__VUE_PROD_DEVTOOLS__ = true;
      const setupDevtoolsMock = setupDevtools as jest.Mock;
      const appMock = getAppMock();
      VueQueryPlugin.install?.(appMock);

      expect(setupDevtoolsMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("when app unmounts", () => {
    test("should call unmount on each client when onUnmount is missing", () => {
      const appMock = getAppMock();
      const customClient = {
        mount: jest.fn(),
        unmount: jest.fn(),
      } as unknown as QueryClient;
      const customClient2 = {
        mount: jest.fn(),
        unmount: jest.fn(),
      } as unknown as QueryClient;
      const originalUnmount = appMock.unmount;
      VueQueryPlugin.install?.(appMock, {
        queryClient: customClient,
        additionalClients: [
          {
            queryClient: customClient2,
            queryClientKey: "client2",
          },
        ],
      });

      appMock.unmount();

      expect(appMock.unmount).not.toEqual(originalUnmount);
      expect(customClient.unmount).toHaveBeenCalledTimes(1);
      expect(customClient2.unmount).toHaveBeenCalledTimes(1);
      expect(originalUnmount).toHaveBeenCalledTimes(1);
    });

    test("should call onUnmount if present", () => {
      const appMock = getAppMock(true);
      const customClient = {
        mount: jest.fn(),
        unmount: jest.fn(),
      } as unknown as QueryClient;
      const originalUnmount = appMock.unmount;
      VueQueryPlugin.install?.(appMock, { queryClient: customClient });

      appMock._unmount();

      expect(appMock.unmount).toEqual(originalUnmount);
      expect(customClient.unmount).toHaveBeenCalledTimes(1);
    });
  });

  describe("when called without additional options", () => {
    testIf(isVue2)("should provide a client with default clientKey", () => {
      const appMock = getAppMock();
      VueQueryPlugin.install?.(appMock);

      appMock._mixin.beforeCreate?.call(appMock);

      expect(appMock._provided).toMatchObject({
        VUE_QUERY_CLIENT: expect.objectContaining({ defaultOptions: {} }),
      });
    });

    testIf(isVue3)("should provide a client with default clientKey", () => {
      const appMock = getAppMock();
      VueQueryPlugin.install?.(appMock);

      expect(appMock.provide).toHaveBeenCalledWith(
        VUE_QUERY_CLIENT,
        expect.objectContaining({ defaultOptions: {} })
      );
    });
  });

  describe("when called with custom clientKey", () => {
    testIf(isVue2)("should provide a client with customized clientKey", () => {
      const appMock = getAppMock();
      VueQueryPlugin.install?.(appMock, { queryClientKey: "CUSTOM" });

      appMock._mixin.beforeCreate?.call(appMock);

      expect(appMock._provided).toMatchObject({
        [VUE_QUERY_CLIENT + ":CUSTOM"]: expect.objectContaining({
          defaultOptions: {},
        }),
      });
    });

    testIf(isVue3)("should provide a client with customized clientKey", () => {
      const appMock = getAppMock();
      VueQueryPlugin.install?.(appMock, { queryClientKey: "CUSTOM" });

      expect(appMock.provide).toHaveBeenCalledWith(
        VUE_QUERY_CLIENT + ":CUSTOM",
        expect.objectContaining({ defaultOptions: {} })
      );
    });
  });

  describe("when called with custom client", () => {
    testIf(isVue2)("should provide that custom client", () => {
      const appMock = getAppMock();
      const customClient = { mount: jest.fn() } as unknown as QueryClient;
      VueQueryPlugin.install?.(appMock, { queryClient: customClient });

      appMock._mixin.beforeCreate?.call(appMock);

      expect(customClient.mount).toHaveBeenCalled();
      expect(appMock._provided).toMatchObject({
        VUE_QUERY_CLIENT: customClient,
      });
    });

    testIf(isVue3)("should provide that custom client", () => {
      const appMock = getAppMock();
      const customClient = { mount: jest.fn() } as unknown as QueryClient;
      VueQueryPlugin.install?.(appMock, { queryClient: customClient });

      expect(customClient.mount).toHaveBeenCalled();
      expect(appMock.provide).toHaveBeenCalledWith(
        VUE_QUERY_CLIENT,
        customClient
      );
    });
  });

  describe("when called with custom client config", () => {
    testIf(isVue2)(
      "should instantiate a client with the provided config",
      () => {
        const appMock = getAppMock();
        const config = {
          defaultOptions: { queries: { enabled: true } },
        };
        VueQueryPlugin.install?.(appMock, {
          queryClientConfig: config,
        });

        appMock._mixin.beforeCreate?.call(appMock);

        expect(appMock._provided).toMatchObject({
          VUE_QUERY_CLIENT: expect.objectContaining(config),
        });
      }
    );

    testIf(isVue3)(
      "should instantiate a client with the provided config",
      () => {
        const appMock = getAppMock();
        const config = {
          defaultOptions: { queries: { enabled: true } },
        };
        VueQueryPlugin.install?.(appMock, {
          queryClientConfig: config,
        });

        expect(appMock.provide).toHaveBeenCalledWith(
          VUE_QUERY_CLIENT,
          expect.objectContaining(config)
        );
      }
    );
  });

  describe("when additional clients are provided", () => {
    testIf(isVue2)(
      "should provide those clients in addition to the default one",
      () => {
        const foo = "Foo";
        const bar = "Bar";
        const appMock = getAppMock();
        const fooClient = {
          mount: jest.fn(),
          name: foo,
        } as unknown as QueryClient;
        const barClient = {
          mount: jest.fn(),
          name: bar,
        } as unknown as QueryClient;
        VueQueryPlugin.install?.(appMock, {
          additionalClients: [
            {
              queryClient: fooClient,
              queryClientKey: foo,
            },
            {
              queryClient: barClient,
              queryClientKey: bar,
            },
          ],
        });

        appMock._mixin.beforeCreate?.call(appMock);

        expect(fooClient.mount).toHaveBeenCalled();
        expect(barClient.mount).toHaveBeenCalled();
        expect(appMock._provided).toMatchObject({
          VUE_QUERY_CLIENT: expect.anything(),
          [`${VUE_QUERY_CLIENT}:${foo}`]: fooClient,
          [`${VUE_QUERY_CLIENT}:${bar}`]: barClient,
        });
      }
    );

    testIf(isVue3)(
      "should provide those clients in addition to the default one",
      () => {
        const foo = "Foo";
        const bar = "Bar";
        const appMock = getAppMock();
        const fooClient = {
          mount: jest.fn(),
          name: foo,
        } as unknown as QueryClient;
        const barClient = {
          mount: jest.fn(),
          name: bar,
        } as unknown as QueryClient;
        VueQueryPlugin.install?.(appMock, {
          additionalClients: [
            {
              queryClient: fooClient,
              queryClientKey: foo,
            },
            {
              queryClient: barClient,
              queryClientKey: bar,
            },
          ],
        });

        expect(fooClient.mount).toHaveBeenCalled();
        expect(barClient.mount).toHaveBeenCalled();
        expect(appMock.provide).toHaveBeenNthCalledWith(
          1,
          VUE_QUERY_CLIENT,
          expect.anything()
        );
        expect(appMock.provide).toHaveBeenNthCalledWith(
          2,
          `${VUE_QUERY_CLIENT}:${foo}`,
          fooClient
        );
        expect(appMock.provide).toHaveBeenNthCalledWith(
          3,
          `${VUE_QUERY_CLIENT}:${bar}`,
          barClient
        );
      }
    );
  });
});
