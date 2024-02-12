import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 7000,
  },
  plugins: [wasm(), topLevelAwait()],
});
