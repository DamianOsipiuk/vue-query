import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  moduleFileExtensions: ["js", "ts"],
  moduleNameMapper: {
    "^vue-query": "<rootDir>/src/index.ts",
  },
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["test-utils.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    // Exclude types
    "!src/**/*.d.ts",
    // Exlude devtools
    "!src/vuejs/devtools/**/*",
  ],
};

export default config;
