import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
  },
  moduleFileExtensions: ["js", "ts", "vue"],
  moduleNameMapper: {
    "^vue-query": "<rootDir>/src/index.ts",
  },
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["test-utils.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,vue}",
    // Exclude types
    "!src/**/*.d.ts",
    // Exlude devtools
    "!src/devtools/**/*",
    "!src/vue/devtools/**/*",
  ],
};

export default config;
