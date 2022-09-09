import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin()],
  // For dev purpose, when using `npm link`. This breaks codesandbox somehow.
  optimizeDeps: {
    // include: ["remove-accents"],
    // exclude: ["vue-query", "vue-demi"],
  },
});
