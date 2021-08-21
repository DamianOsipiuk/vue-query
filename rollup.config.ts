import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";

const common = {
  plugins: [resolve(), autoExternal(), typescript(), vue(), postcss()],
  watch: {
    include: "src/**",
    exclude: ["node_modules/**", "tests"],
  },
};
export default [
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
    input: "src/devtools/index.ts",
    output: {
      file: "lib/devtools.js",
      format: "cjs",
      sourcemap: true,
    },
    ...common,
  },
  {
    input: "src/nuxt/index.ts",
    output: {
      file: "lib/nuxt.js",
      format: "cjs",
      sourcemap: true,
    },
    ...common,
  },
  {
    input: "src/index.ts",
    output: {
      dir: "esm",
      format: "esm",
      sourcemap: true,
    },
    ...common,
  },
  {
    input: "src/devtools/index.ts",
    output: {
      file: "esm/devtools.js",
      format: "esm",
      sourcemap: true,
    },
    ...common,
  },
  {
    input: "src/nuxt/index.ts",
    output: {
      file: "esm/nuxt.js",
      format: "esm",
      sourcemap: true,
    },
    ...common,
  },
];
