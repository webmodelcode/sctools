import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing";
import path from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    mockReset: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "~@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [WxtVitest()],
});
