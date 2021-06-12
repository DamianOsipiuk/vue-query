import { useContext } from "@nuxtjs/composition-api";
import { useNuxtQueryProvider } from "../../src/ssr/useNuxtQueryProvider";
import { useQueryClient, useQueryProvider } from "../../src/index";
import { hydrate } from "../../src/ssr/hydration";

jest.mock("@nuxtjs/composition-api", () => ({
  useContext: jest.fn(),
}));

jest.mock("../../src/index", () => ({
  useQueryClient: jest.fn(),
  useQueryProvider: jest.fn(),
}));

jest.mock("../../src/ssr/hydration", () => ({
  hydrate: jest.fn(),
}));

const withVueQueryState = { nuxtState: { vueQueryState: {} } };
const withoutVueQueryState = { nuxtState: {} };

describe("useNuxtQueryProvider", () => {
  const useContextSpy = useContext as jest.Mock;
  const useQueryProviderSpy = useQueryProvider as jest.Mock;
  const useQueryClientSpy = useQueryClient as jest.Mock;
  const hydrateSpy = hydrate as jest.Mock;

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    // @ts-expect-error Nuxt.js injected client property
    process.client = true;
  });

  test("should call queryProvider", () => {
    // @ts-expect-error Nuxt.js injected client property
    process.client = false;
    useNuxtQueryProvider();

    expect(useQueryProviderSpy).toHaveBeenCalledTimes(1);
  });

  test("should call useQueryClient when vueQueryState is present", () => {
    useContextSpy.mockReturnValueOnce(withVueQueryState);
    useNuxtQueryProvider();

    expect(useQueryClientSpy).toHaveBeenCalledTimes(1);
  });

  test("should NOT call useQueryClient when vueQueryState is NOT present", () => {
    useContextSpy.mockReturnValueOnce(withoutVueQueryState);
    useNuxtQueryProvider();

    expect(useQueryClientSpy).toHaveBeenCalledTimes(0);
  });

  test("should call hydrate when vueQueryState is present", () => {
    useContextSpy.mockReturnValueOnce(withVueQueryState);
    useNuxtQueryProvider();

    expect(hydrateSpy).toHaveBeenCalledTimes(1);
  });

  test("should NOT call hydrate when vueQueryState is NOT present", () => {
    useContextSpy.mockReturnValueOnce(withoutVueQueryState);
    useNuxtQueryProvider();

    expect(hydrateSpy).toHaveBeenCalledTimes(0);
  });
});
