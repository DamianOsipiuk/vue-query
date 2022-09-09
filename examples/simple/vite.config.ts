import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // For dev purpose, when using `npm link`. This breaks codesandbox somehow.
  optimizeDeps: {
    // include: ["remove-accents"],
    // exclude: ["vue-query", "vue-demi"],
  },
});
