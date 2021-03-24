import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  moduleFileExtensions: ["js", "ts", "vue"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/!(*.d).{ts,vue}"],
};

export default config;
