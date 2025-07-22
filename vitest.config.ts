import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    mockReset: true,
    restoreMocks: true,
  },
  plugins: [WxtVitest()],
});
