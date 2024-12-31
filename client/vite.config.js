import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:8000", // Proxy `/api` requests to the Express server
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        about: "./about.html",
        play: "./game.html",
        levels: "./levels.html",
      },
    },
  },
});
