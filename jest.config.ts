import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  moduleFileExtensions: ["js", "ts"],
  collectCoverage: true,
};

export default config;
