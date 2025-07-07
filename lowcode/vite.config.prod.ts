import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  assetsInclude: ['**/*.(jpg|jpeg)'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 lodash 单独打包
          lodash: ['lodash'],
          // antd: ['antd'],
          reactdom: ['react-dom'],
          router: ['react-router-dom']

        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://150.158.97.130:3000",
      },
      "/static": "http://150.158.97.130:5078",
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
