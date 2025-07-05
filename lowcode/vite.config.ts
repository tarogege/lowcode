import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  assetsInclude: ['**/*.(jpg|jpeg)'],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
      "/static": "http://template.codebus.tech",
    },
  },
  css: {
    modules: {
      hashPrefix: "prefix",
    },

    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
