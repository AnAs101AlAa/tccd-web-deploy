import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  base: import.meta.env.VITE_API_BASE_URL,

  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    target: "es2015",
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "iife",
      }
    }
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})