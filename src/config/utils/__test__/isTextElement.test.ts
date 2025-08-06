import { describe, expect, it } from "vitest";
import { isEditableElement } from "../isTextElement";

describe("isEditableElement", () => {
  it("should return true for input elements", () => {
    const mockInputElement = document.createElement("input");
    expect(isEditableElement(mockInputElement)).toBe(true);
  });

  it("should return true for textarea elements", () => {
    const mockTextareaElement = document.createElement("textarea");
    expect(isEditableElement(mockTextareaElement)).toBe(true);
  });

  it("should return true for contenteditable elements", () => {
    const mockContentEditableElement = document.createElement("div");
    mockContentEditableElement.contentEditable = "true";
    expect(isEditableElement(mockContentEditableElement)).toBe(true);
  });

  it("should return false for non-editable elements", () => {
    const mockNonEditableElement = document.createElement("div");
    expect(isEditableElement(mockNonEditableElement)).toBe(false);
  });
});
