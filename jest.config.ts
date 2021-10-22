import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
  },
  moduleFileExtensions: ["js", "ts", "vue"],
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,vue}",
    // Exclude types
    "!src/**/*.d.ts",
    // Exlude devtools
    "!src/devtools/**/*",
  ],
};

export default config;
