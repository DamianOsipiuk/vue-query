import { successMutator, simpleFetcher } from "./test-utils";
import {
  isQueryKey,
  parseFilterArgs,
  parseMutationArgs,
  parseQueryArgs,
  updateState,
} from "../src/utils";

describe("utils", () => {
  describe("isQueryKey", () => {
    test("should detect string as query key", () => {
      expect(isQueryKey("string")).toEqual(true);
    });

    test("should detect an array as query key", () => {
      expect(isQueryKey(["string", "array"])).toEqual(true);
    });
  });

  describe("parseFilterArgs", () => {
    test("should default to empty options", () => {
      const filters = { active: true };

      const result = parseFilterArgs(filters);
      const expected = [filters, {}];

      expect(result).toEqual(expected);
      expect(result[0]).toBe(filters);
    });

    test("should default to empty filters", () => {
      const options = { option1: false };

      const result = parseFilterArgs(undefined, options);
      const expected = [{}, options];

      expect(result).toEqual(expected);
      expect(result[1]).toBe(options);
    });

    test("should covert to array of parameters", () => {
      const filters = { active: true };
      const options = { option1: false };

      const result = parseFilterArgs(filters, options);
      const expected = [filters, options];

      expect(result).toEqual(expected);
      expect(result[0]).toBe(filters);
      expect(result[1]).toBe(options);
    });

    test("should merge query key with filters", () => {
      const filters = { active: true };
      const options = { option1: false };

      const result = parseFilterArgs("key", filters, options);
      const expected = [{ ...filters, queryKey: "key" }, options];

      expect(result).toEqual(expected);
      expect(result[0]).toBe(filters);
      expect(result[1]).toBe(options);
    });
  });

  describe("parseMutationArgs", () => {
    test("should return the same instance of options", () => {
      const options = { retry: false };
      const result = parseMutationArgs(options);

      expect(result).toBe(options);
    });

    test("should merge query key with options", () => {
      const options = { retry: false };
      const result = parseMutationArgs("key", options);
      const expected = { ...options, mutationKey: "key" };

      expect(result).toEqual(expected);
      expect(result).toBe(options);
    });

    test("should merge query fn with options", () => {
      const options = { retry: false };
      const result = parseMutationArgs(successMutator, options);
      const expected = { ...options, mutationFn: successMutator };

      expect(result).toEqual(expected);
      expect(result).toBe(options);
    });

    test("should merge query key and fn with options", () => {
      const options = { retry: false };
      const result = parseMutationArgs("key", successMutator, options);
      const expected = {
        ...options,
        mutationKey: "key",
        mutationFn: successMutator,
      };

      expect(result).toEqual(expected);
      expect(result).toBe(options);
    });
  });

  describe("parseQueryArgs", () => {
    test("should return the same instance of options", () => {
      const options = { retry: false };
      const result = parseQueryArgs(options);

      expect(result).toBe(options);
    });

    test("should merge query key with options", () => {
      const options = { retry: false };
      const result = parseQueryArgs("key", options);
      const expected = { ...options, queryKey: "key" };

      expect(result).toEqual(expected);
      expect(result).toBe(options);
    });

    test("should merge query key and fn with options", () => {
      const options = { retry: false };
      const result = parseQueryArgs("key", simpleFetcher, options);
      const expected = {
        ...options,
        queryKey: "key",
        queryFn: simpleFetcher,
      };

      expect(result).toEqual(expected);
      expect(result).toBe(options);
    });
  });

  describe("updateState", () => {
    test("should update first object with values from the second one", () => {
      const origin = { option1: "a", option2: "b", option3: "c" };
      const update = { option1: "x", option2: "y", option3: "z" };
      const expected = { option1: "x", option2: "y", option3: "z" };

      updateState(origin, update);
      expect(origin).toEqual(expected);
    });

    test("should update only existing keys", () => {
      const origin = { option1: "a", option2: "b" };
      const update = { option1: "x", option2: "y", option3: "z" };
      const expected = { option1: "x", option2: "y" };

      updateState(origin, update);
      expect(origin).toEqual(expected);
    });

    test("should remove non existing keys", () => {
      const origin = { option1: "a", option2: "b", option3: "c" };
      const update = { option1: "x", option2: "y" };
      const expected = { option1: "x", option2: "y" };

      updateState(origin, update);
      expect(origin).toEqual(expected);
    });
  });
});
