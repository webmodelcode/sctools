import { resolve } from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    alias: {
      // Maintain same aliases as Plasmo for consistency
      "~": resolve(__dirname, "src"),
      "@": resolve(__dirname, ".")
    }
  }
})
