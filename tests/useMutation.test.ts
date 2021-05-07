import { QueryClient, setLogger } from "react-query/core";

import {
  errorMutator,
  flushPromises,
  noop,
  successMutator,
} from "./test-utils";
import { useMutation } from "../src/useMutation";

jest.mock("vue-demi", () => {
  const vue = jest.requireActual("vue-demi");
  return {
    ...vue,
    onUnmounted: jest.fn(),
  };
});

jest.mock("../src/useQueryClient", () => {
  const queryClient = new QueryClient();
  return {
    useQueryClient: jest.fn(() => queryClient),
  };
});

describe("useMutation", () => {
  beforeAll(() => {
    setLogger({ log: noop, warn: noop, error: noop });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should be in idle state initially", () => {
    const mutation = useMutation((params) => successMutator(params));

    expect(mutation).toMatchObject({
      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,
    });
  });

  test("should change state after invoking mutate", () => {
    const result = "Mock data";
    const mutation = useMutation((params: string) => successMutator(params));

    mutation.mutate(result);

    expect(mutation).toMatchObject({
      isIdle: false,
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
    });
  });

  test("should return error when request fails", async () => {
    const mutation = useMutation(errorMutator);

    mutation.mutate();

    await flushPromises(10);

    expect(mutation).toMatchObject({
      isIdle: false,
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: undefined,
      error: Error("Some error"),
    });
  });

  test("should return data when request succeeds", async () => {
    const result = "Mock data";
    const mutation = useMutation((params: string) => successMutator(params));

    mutation.mutate(result);

    await flushPromises(10);

    expect(mutation).toMatchObject({
      isIdle: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: "Mock data",
      error: null,
    });
  });

  test("should reset state after invoking mutation.reset", async () => {
    const mutation = useMutation((params: string) => errorMutator(params));

    mutation.mutate("");

    await flushPromises(10);

    mutation.reset();

    expect(mutation).toMatchObject({
      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
    });
  });

  describe("side effects", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should call onMutate when passed as an option", async () => {
      const onMutate = jest.fn();
      const mutation = useMutation((params: string) => successMutator(params), {
        onMutate,
      });

      mutation.mutate("");

      await flushPromises(10);

      expect(onMutate).toHaveBeenCalledTimes(1);
    });

    test("should call onError when passed as an option", async () => {
      const onError = jest.fn();
      const mutation = useMutation((params: string) => errorMutator(params), {
        onError,
      });

      mutation.mutate("");

      await flushPromises(10);

      expect(onError).toHaveBeenCalledTimes(1);
    });

    test("should call onSuccess when passed as an option", async () => {
      const onSuccess = jest.fn();
      const mutation = useMutation((params: string) => successMutator(params), {
        onSuccess,
      });

      mutation.mutate("");

      await flushPromises(10);

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    test("should call onSettled when passed as an option", async () => {
      const onSettled = jest.fn();
      const mutation = useMutation((params: string) => successMutator(params), {
        onSettled,
      });

      mutation.mutate("");

      await flushPromises(10);

      expect(onSettled).toHaveBeenCalledTimes(1);
    });

    test("should call onError when passed as an argument of mutate function", async () => {
      const onError = jest.fn();
      const mutation = useMutation((params: string) => errorMutator(params));

      mutation.mutate("", { onError });

      await flushPromises(10);

      expect(onError).toHaveBeenCalledTimes(1);
    });

    test("should call onSuccess when passed as an argument of mutate function", async () => {
      const onSuccess = jest.fn();
      const mutation = useMutation((params: string) => successMutator(params));

      mutation.mutate("", { onSuccess });

      await flushPromises(10);

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    test("should call onSettled when passed as an argument of mutate function", async () => {
      const onSettled = jest.fn();
      const mutation = useMutation((params: string) => successMutator(params));

      mutation.mutate("", { onSettled });

      await flushPromises(10);

      expect(onSettled).toHaveBeenCalledTimes(1);
    });

    test("should fire both onSettled functions", async () => {
      const onSettled = jest.fn();
      const onSettledOnFunction = jest.fn();
      const mutation = useMutation((params: string) => successMutator(params), {
        onSettled,
      });

      mutation.mutate("", { onSettled: onSettledOnFunction });

      await flushPromises(10);

      expect(onSettled).toHaveBeenCalledTimes(1);
      expect(onSettledOnFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("async", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should resolve properly", async () => {
      const result = "Mock data";
      const mutation = useMutation((params: string) => successMutator(params));

      await expect(mutation.mutateAsync(result)).resolves.toBe(result);

      expect(mutation).toMatchObject({
        isIdle: false,
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: "Mock data",
        error: null,
      });
    });

    test("should throw on error", async () => {
      const mutation = useMutation(errorMutator);

      await expect(mutation.mutateAsync()).rejects.toThrowError("Some error");

      expect(mutation).toMatchObject({
        isIdle: false,
        isLoading: false,
        isError: true,
        isSuccess: false,
        data: undefined,
        error: Error("Some error"),
      });
    });
  });
});
