import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:5555",
        target:
          "postgresql://matthewkennedy:7EwrmP1dGCw7ibjBY2jhNHSjvuY1m3HW@dpg-cqluj0aj1k6c739rvcp0-a.ohio-postgres.render.com/danceschoolserver",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
