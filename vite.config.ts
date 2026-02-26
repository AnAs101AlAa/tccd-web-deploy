import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import path from "path"

export default defineConfig({
  base: "./",   // important for WP

  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile()
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