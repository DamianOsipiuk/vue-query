import { App, ComponentOptions } from "vue";
import { isVue2, isVue3 } from "vue-demi";

import type { QueryClient } from "../queryClient";
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

    testIf(isVue2)("should setup devtools", () => {
      const envCopy = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";
      const setupDevtoolsMock = setupDevtools as jest.Mock;
      const appMock = getAppMock();
      VueQueryPlugin.install?.(appMock);

      appMock._mixin.beforeCreate?.call(appMock);
      process.env.NODE_ENV = envCopy;

      expect(setupDevtoolsMock).toHaveBeenCalledTimes(1);
    });

    testIf(isVue3)("should setup devtools", () => {
      const envCopy = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";
      const setupDevtoolsMock = setupDevtools as jest.Mock;
      const appMock = getAppMock();
      VueQueryPlugin.install?.(appMock);
      process.env.NODE_ENV = envCopy;

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
      const originalUnmount = appMock.unmount;
      VueQueryPlugin.install?.(appMock, {
        queryClient: customClient,
      });

      appMock.unmount();

      expect(appMock.unmount).not.toEqual(originalUnmount);
      expect(customClient.unmount).toHaveBeenCalledTimes(1);
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
});
