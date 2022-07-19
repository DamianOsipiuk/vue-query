import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const common = {
  plugins: [resolve(), typescript()],
  external: [
    "vue-query",
    "@tanstack/query-core",
    "vue",
    "vue-demi",
    "match-sorter",
    "@vue/devtools-api",
  ],
  watch: {
    include: "src/**",
    exclude: ["node_modules/**", "__tests__", "__mocks__"],
  },
};
export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      dir: "lib",
      format: "cjs",
      sourcemap: true,
    },
    ...common,
  },
  {
    input: "src/index.ts",
    output: {
      dir: "lib",
      format: "esm",
      entryFileNames: "[name].mjs",
      sourcemap: true,
    },
    ...common,
  },
]);
