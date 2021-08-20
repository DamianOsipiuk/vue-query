import { useNuxtDehydrate } from "../useNuxtDehydrate";

jest.mock("../hydration", () => ({
  dehydrate: jest.fn(() => "dehydrated"),
}));

const nothing = {} as never;

describe("useNuxtDehydrate", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("should inject dehydrated queryClient state to nuxt context", () => {
    const context = { nuxt: { vueQueryState: undefined } };

    useNuxtDehydrate(context, nothing);

    expect(context.nuxt.vueQueryState).toStrictEqual("dehydrated");
  });

  test("should throw an error when ssrContext is not provided", () => {
    expect(useNuxtDehydrate).toThrowError();
  });

  test("should throw an error when ssrContext is not a valid object", () => {
    const shouldThrow = () => {
      useNuxtDehydrate(nothing, nothing);
    };

    expect(shouldThrow).toThrowError();
  });
});
