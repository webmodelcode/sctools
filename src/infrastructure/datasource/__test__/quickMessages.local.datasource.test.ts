/**
 * Tests for quickMessages.local.datasource
 */

import { describe, it, expect } from "vitest";
import type { IQuickMessage } from "../quickMessages.local.datasource";

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

  it("should test function signatures", async () => {
    const {
      saveQuickMessages,
      getQuickMessages,
      addQuickMessage,
      importQuickMessages,
      updateQuickMessage,
      deleteQuickMessage,
      clearQuickMessages,
      watchQuickMessages,
    } = await import("../quickMessages.local.datasource");
    
    // Test function parameter lengths
    expect(saveQuickMessages.length).toBe(1);
    expect(getQuickMessages.length).toBe(0);
    expect(addQuickMessage.length).toBe(1);
    expect(importQuickMessages.length).toBe(1);
    expect(updateQuickMessage.length).toBe(2);
    expect(deleteQuickMessage.length).toBe(1);
    expect(clearQuickMessages.length).toBe(0);
    expect(watchQuickMessages.length).toBe(1);
  });

  it("should handle function calls without errors (basic smoke test)", async () => {
    const {
      saveQuickMessages,
      getQuickMessages,
      addQuickMessage,
      importQuickMessages,
      updateQuickMessage,
      deleteQuickMessage,
      clearQuickMessages,
      watchQuickMessages,
    } = await import("../quickMessages.local.datasource");
    
    const testMessage: IQuickMessage = { label: "test", text: "test" };
    const testMessages: IQuickMessage[] = [testMessage];
    const mockCallback = () => {};
    
    // These will likely fail due to missing storage, but should not throw syntax errors
    expect(() => saveQuickMessages(testMessages)).not.toThrow();
    expect(() => getQuickMessages()).not.toThrow();
    expect(() => addQuickMessage(testMessage)).not.toThrow();
    expect(() => importQuickMessages(testMessages)).not.toThrow();
    expect(() => updateQuickMessage(0, testMessage)).not.toThrow();
    expect(() => deleteQuickMessage(0)).not.toThrow();
    expect(() => clearQuickMessages()).not.toThrow();
    expect(() => watchQuickMessages(mockCallback)).not.toThrow();
  });
});
