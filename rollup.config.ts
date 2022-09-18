import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import commonJS from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

const babelPlugin = babel({
  babelHelpers: "bundled",
  exclude: /node_modules/,
  extensions: [".ts", ".tsx"],
});

const common = {
  plugins: [
    commonJS(),
    babelPlugin,
    nodeResolve({ extensions: [".ts", ".tsx"] }),
  ],
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
    ...common,
    input: "src/index.ts",
    output: {
      format: "cjs",
      file: `./lib/index.js`,
      sourcemap: true,
      exports: "named",
    },
  },
  {
    ...common,
    input: "src/index.ts",
    output: {
      format: "esm",
      sourcemap: true,
      dir: "lib",
      entryFileNames: "[name].mjs",
    },
  },
]);
