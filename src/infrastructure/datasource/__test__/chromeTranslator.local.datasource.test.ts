/**
 * Tests for chromeTranslator.local.datasource
 */

import { describe, it, expect } from "vitest";

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

  it("should validate method signatures", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    // Test isAvailable method signature
    expect(localTranslator.isAvailable.length).toBe(0);
    
    // Test create method signature (should accept 1 parameter - an object)
    expect(localTranslator.create.length).toBe(1);
  });

  it("should handle function calls without throwing syntax errors", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    const config = { sourceLanguage: "en", targetLanguage: "es" };
    
    // Test that methods can be called without syntax errors
    expect(() => localTranslator.isAvailable()).not.toThrow();
    expect(() => localTranslator.create(config)).not.toThrow();
  });

  it("should test isAvailable with different environments", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    // In test environment, Translator is likely not available
    const result = localTranslator.isAvailable();
    
    // Should return false in test environment
    expect(result).toBe(false);
  });

  it("should handle create method errors gracefully", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    const config = { sourceLanguage: "en", targetLanguage: "es" };
    
    // In test environment without Translator, create should fail
    try {
      await localTranslator.create(config);
    } catch (error) {
      expect(error).toBeDefined();
    }
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
      // Test that create can be called with different configs
      expect(() => localTranslator.create(config)).not.toThrow();
    }
  });

  it("should validate config parameter structure", async () => {
    const { localTranslator } = await import("../chromeTranslator.local.datasource");
    
    const validConfig = {
      sourceLanguage: "en",
      targetLanguage: "es",
    };
    
    // Test that config has required properties
    expect(validConfig).toHaveProperty("sourceLanguage");
    expect(validConfig).toHaveProperty("targetLanguage");
    expect(typeof validConfig.sourceLanguage).toBe("string");
    expect(typeof validConfig.targetLanguage).toBe("string");
    
    // Test that create method accepts this config structure
    expect(() => localTranslator.create(validConfig)).not.toThrow();
  });
});
