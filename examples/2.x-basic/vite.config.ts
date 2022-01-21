import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin()],
  optimizeDeps: {
    include: ["vue-query/devtools", "vue-demi"],
    exclude: ["vue-query"],
  },
});
