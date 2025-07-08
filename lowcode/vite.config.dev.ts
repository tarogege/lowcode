import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), visualizer({
    open: true,          // 构建完成后自动打开报告
    gzipSize: true,      // 显示 gzip 压缩后的体积（更贴近实际传输大小）
    brotliSize: true,    // 显示 brotli 压缩体积
    filename: "stats.html" // 输出文件名
  })],
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
        target: "http://localhost:3000",
      },
      "/static": "http://localhost:5078",
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
