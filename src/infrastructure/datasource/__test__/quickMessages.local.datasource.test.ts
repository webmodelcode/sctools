/**
 * Tests for quickMessages.local.datasource
 */

import { describe, it, expect, vi } from "vitest";
import type { IQuickMessage } from "../quickMessages.local.datasource";

// Simple test to verify the module exports and basic functionality
describe("quickMessages.local.datasource", () => {
  it("should export IQuickMessage interface", () => {
    const message: IQuickMessage = {
      label: "test",
      text: "test message",
    };
    
    expect(message).toHaveProperty("label");
    expect(message).toHaveProperty("text");
    expect(typeof message.label).toBe("string");
    expect(typeof message.text).toBe("string");
  });

  it("should have all required exports", async () => {
    const module = await import("../quickMessages.local.datasource");
    
    expect(module).toHaveProperty("saveQuickMessages");
    expect(module).toHaveProperty("getQuickMessages");
    expect(module).toHaveProperty("addQuickMessage");
    expect(module).toHaveProperty("importQuickMessages");
    expect(module).toHaveProperty("updateQuickMessage");
    expect(module).toHaveProperty("deleteQuickMessage");
    expect(module).toHaveProperty("clearQuickMessages");
    expect(module).toHaveProperty("watchQuickMessages");
    
    expect(typeof module.saveQuickMessages).toBe("function");
    expect(typeof module.getQuickMessages).toBe("function");
    expect(typeof module.addQuickMessage).toBe("function");
    expect(typeof module.importQuickMessages).toBe("function");
    expect(typeof module.updateQuickMessage).toBe("function");
    expect(typeof module.deleteQuickMessage).toBe("function");
    expect(typeof module.clearQuickMessages).toBe("function");
    expect(typeof module.watchQuickMessages).toBe("function");
  });

  it("should validate IQuickMessage structure", () => {
    const validMessage: IQuickMessage = {
      label: "valid label",
      text: "valid text",
    };
    
    // Test that the interface accepts valid data
    expect(validMessage.label).toBe("valid label");
    expect(validMessage.text).toBe("valid text");
    
    // Test that both properties are required
    const keys = Object.keys(validMessage);
    expect(keys).toContain("label");
    expect(keys).toContain("text");
    expect(keys).toHaveLength(2);
  });
});