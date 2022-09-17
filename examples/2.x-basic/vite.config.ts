import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue2()],
  // For dev purpose, when using `npm link`. This breaks codesandbox somehow.
  // optimizeDeps: { exclude: ["vue-query", "vue-demi"] },
});
