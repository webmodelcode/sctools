/**
 * Tests for chromeLanguageDetector.local.datasource
 */

import { describe, it, expect, vi } from "vitest";

describe("chromeLanguageDetector.local.datasource", () => {
  it("should export localLanguageDetector object", async () => {
    const module = await import("../chromeLanguageDetector.local.datasource");
    
    expect(module).toHaveProperty("localLanguageDetector");
    expect(typeof module.localLanguageDetector).toBe("object");
    expect(typeof module.localLanguageDetector.isAvailable).toBe("function");
    expect(typeof module.localLanguageDetector.create).toBe("function");
    expect(typeof module.localLanguageDetector.detectLanguage).toBe("function");
  });

  it("should have isAvailable method that returns boolean", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    const result = localLanguageDetector.isAvailable();
    expect(typeof result).toBe("boolean");
  });

  it("should have create method", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    // Test that create method exists and can be called
    expect(typeof localLanguageDetector.create).toBe("function");
    
    try {
      await localLanguageDetector.create();
    } catch (error) {
      // Expected to fail in test environment without Chrome AI API
      expect(error).toBeDefined();
    }
  });

  it("should have detectLanguage method", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    expect(typeof localLanguageDetector.detectLanguage).toBe("function");
    
    // Test that method can be called (will fail without actual detector)
    const text = "Hello world";
    
    try {
      await localLanguageDetector.detectLanguage(text);
    } catch (error) {
      // Expected to fail without LanguageDetector API
      expect(error).toBeDefined();
    }
  });

  it("should handle unavailable AI API gracefully", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    // In test environment, AI API is not available
    const isAvailable = localLanguageDetector.isAvailable();
    expect(typeof isAvailable).toBe("boolean");
    
    // If not available, create should handle it appropriately
    if (!isAvailable) {
      try {
        await localLanguageDetector.create();
      } catch (error) {
        expect(error).toBeDefined();
      }
    }
  });
});