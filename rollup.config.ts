import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";

const common = (typescriptOptions = {}, additionalPlugins = []) => {
  return {
    plugins: [
      resolve(),
      autoExternal(),
      typescript(typescriptOptions),
      vue(),
      postcss(),
      ...additionalPlugins,
    ],
    watch: {
      include: "src/**",
      exclude: ["node_modules/**", "tests"],
    },
  };
};

const es5Override = {
  tsconfigOverride: {
    compilerOptions: {
      target: "es5",
    },
  },
};

const noTypesOverride = {
  tsconfigOverride: {
    compilerOptions: {
      declaration: false,
    },
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
    ...common(es5Override),
  },
  {
    input: "src/devtools/index.ts",
    output: {
      file: "lib/devtools.js",
      format: "cjs",
      sourcemap: true,
    },
    ...common(es5Override),
  },
  {
    input: "src/index.ts",
    output: {
      dir: "esm",
      format: "esm",
      sourcemap: true,
    },
    ...common(noTypesOverride),
  },
  {
    input: "src/devtools/index.ts",
    output: {
      file: "esm/devtools.js",
      format: "esm",
      sourcemap: true,
    },
    ...common(noTypesOverride),
  },
  {
    input: "src/index.ts",
    output: {
      name: "VueQuery",
      file: "umd/vue-query.min.js",
      format: "umd",
      sourcemap: true,
    },
    ...common(noTypesOverride, [terser()]),
  },
  {
    input: "src/devtools/index.ts",
    output: {
      name: "VueQueryDevTools",
      file: "umd/vue-query-devtools.min.js",
      format: "esm",
      sourcemap: true,
    },
    ...common(noTypesOverride, [terser()]),
  },
];
