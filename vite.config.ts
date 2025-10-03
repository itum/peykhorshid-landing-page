import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // بارگیری متغیرهای محیطی
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
      historyApiFallback: true,
    },
    plugins: [
      react(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // تعریف متغیرهای محیطی برای استفاده در کد
      __APP_ENV__: JSON.stringify(mode),
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      cssCodeSplit: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-components': ['@/components/ui'],
          },
        },
      },
    },
  };
});
