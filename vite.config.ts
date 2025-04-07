import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: './',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), // Remove why-did-you-render reference
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: [], // Add any actual external deps here if needed
    }
  }
});