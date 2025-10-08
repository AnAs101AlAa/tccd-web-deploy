import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://backendgoeshere.com", // replace with your backend URL
        changeOrigin: true,
        secure: true, // because target is https
        // IMPORTANT: do NOT rewrite /api -> "" because your backend expects /api/...
        // rewrite: (p) => p.replace(/^\/api/, ""), // <-- leave this OUT
      },
    },
  },
});
