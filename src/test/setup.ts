import "@testing-library/jest-dom"

import { vi } from "vitest"

// Chrome API mock implementation
const mockChrome = {
  runtime: {
    getManifest: () => ({ version: "1.0.0" }),
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn()
    }
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn()
    }
  }
}

global.chrome = mockChrome as unknown as typeof chrome
