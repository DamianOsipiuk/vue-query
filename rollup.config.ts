import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import postcss from "rollup-plugin-postcss";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";

export default {
  input: "src/index.ts",
  output: {
    dir: "lib",
    name: "VueQuery",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    autoExternal(),
    typescript(),
    vue({
      cssModulesOptions: {
        generateScopedName: "[local]___[hash:base64:5]",
      },
    }),
    postcss(),
  ],
  watch: {
    include: "src/**",
    exclude: ["node_modules/**", "tests"],
  },
};
