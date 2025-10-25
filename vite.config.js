// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/<repo-name>/", // <-- set your repo name here, e.g. "/ai-fashion-app/"
  plugins: [react()],
  server: { port: 5173 }
});
