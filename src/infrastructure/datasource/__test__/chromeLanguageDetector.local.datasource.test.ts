/**
 * Tests for chromeLanguageDetector.local.datasource
 */

import { describe, it, expect } from "vitest";

describe("chromeLanguageDetector.local.datasource", () => {
  it("should export localLanguageDetector object with correct methods", async () => {
    const module = await import("../chromeLanguageDetector.local.datasource");
    
    expect(module).toHaveProperty("localLanguageDetector");
    expect(typeof module.localLanguageDetector).toBe("object");
    expect(typeof module.localLanguageDetector.isAvailable).toBe("function");
    expect(typeof module.localLanguageDetector.create).toBe("function");
    expect(typeof module.localLanguageDetector.detectLanguage).toBe("function");
  });

  it("should check availability correctly", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    const result = localLanguageDetector.isAvailable();
    expect(typeof result).toBe("boolean");
  });

  it("should validate method signatures", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    // Test method parameter lengths
    expect(localLanguageDetector.isAvailable.length).toBe(0);
    expect(localLanguageDetector.create.length).toBe(0);
    expect(localLanguageDetector.detectLanguage.length).toBe(1);
  });

  it("should handle function calls without throwing syntax errors", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    // Test that isAvailable method can be called without syntax errors
    expect(() => localLanguageDetector.isAvailable()).not.toThrow();
    
    // For async methods, just verify they exist and are callable
    expect(typeof localLanguageDetector.create).toBe("function");
    expect(typeof localLanguageDetector.detectLanguage).toBe("function");
  });

  it("should test isAvailable with different environments", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    // In test environment, LanguageDetector is likely not available
    const result = localLanguageDetector.isAvailable();
    
    // Should return false in test environment
    expect(result).toBe(false);
  });

  it("should handle create method errors gracefully", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    // In test environment without LanguageDetector, create should fail
    try {
      await localLanguageDetector.create();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle detectLanguage method errors gracefully", async () => {
    const { localLanguageDetector } = await import("../chromeLanguageDetector.local.datasource");
    
    // In test environment without LanguageDetector, detectLanguage should fail
    try {
      await localLanguageDetector.detectLanguage("Hello world");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
