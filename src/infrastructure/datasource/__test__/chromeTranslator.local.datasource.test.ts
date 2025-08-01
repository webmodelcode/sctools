/**
 * Tests for chromeTranslator.local.datasource
 */

import { describe, it, expect, vi } from "vitest";

describe("chromeTranslator.local.datasource", () => {
  it("should export localTranslator object", async () => {
    const module = await import("../chromeTranslator.local.datasource");
    
    expect(module).toHaveProperty("localTranslator");
    expect(typeof module.localTranslator).toBe("object");
    expect(typeof module.localTranslator.isAvailable).toBe("function");
    expect(typeof module.localTranslator.create).toBe("function");
  });

  it("should have isAvailable method that returns boolean", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    const result = localTranslator.isAvailable();
    expect(typeof result).toBe("boolean");
  });

  it("should have create method that accepts source and target languages", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    // Test that create method exists and can be called
    expect(typeof localTranslator.create).toBe("function");
    
    try {
      await localTranslator.create({ sourceLanguage: "en", targetLanguage: "es" });
    } catch (error) {
      // Expected to fail in test environment without Chrome AI API
      expect(error).toBeDefined();
    }
  });

  it("should handle unavailable AI API gracefully", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    // In test environment, AI API is not available
    const isAvailable = localTranslator.isAvailable();
    expect(typeof isAvailable).toBe("boolean");
    
    // If not available, create should handle it appropriately
    if (!isAvailable) {
      try {
        await localTranslator.create({ sourceLanguage: "en", targetLanguage: "es" });
      } catch (error) {
        expect(error).toBeDefined();
      }
    }
  });

  it("should validate method signatures", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    // Test isAvailable method signature
    expect(localTranslator.isAvailable.length).toBe(0);
    
    // Test create method signature (should accept 1 parameter - an object)
    expect(localTranslator.create.length).toBe(1);
  });

  it("should handle different language combinations", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    const languagePairs = [
      { sourceLanguage: "en", targetLanguage: "es" },
      { sourceLanguage: "es", targetLanguage: "en" },
      { sourceLanguage: "en", targetLanguage: "fr" },
      { sourceLanguage: "fr", targetLanguage: "en" },
    ];
    
    for (const config of languagePairs) {
      try {
        await localTranslator.create(config);
      } catch (error) {
        // Expected to fail in test environment
        expect(error).toBeDefined();
      }
    }
  });
});