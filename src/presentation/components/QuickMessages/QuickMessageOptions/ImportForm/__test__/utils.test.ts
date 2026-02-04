/**
 * Tests for ImportForm utilities
 */
import { describe, it, expect } from "vitest";
import { cleanInternalText, normalizeJsonEntries } from "../utils";

describe("ImportForm utils", () => {
  describe("cleanInternalText", () => {
    it("should trim whitespace", () => {
      expect(cleanInternalText("  text  ")).toBe("text");
    });

    it("should normalize smart apostrophes", () => {
      expect(cleanInternalText("Don’t")).toBe("Don't");
      expect(cleanInternalText("‘Hello’")).toBe("'Hello'");
    });

    it("should normalize smart double quotes", () => {
      expect(cleanInternalText("“Hello”")).toBe('"Hello"');
    });

    it("should handle mixed smart quotes", () => {
      expect(cleanInternalText("“Don’t”")).toBe('"Don\'t"');
    });
  });

  describe("normalizeJsonEntries", () => {
    it("should parse standard JSON-like entries", () => {
      // Our regex expects the explicit { label: ..., text: ... } format found inside the array strings typically, or we need to ensure the regex matches standard JSON
      // The current regex expects: { "label": "...", "text": "..." }

      // Let's test with the format the regex detects: objects with label/text keys
      const data = '{"label": "test", "text": "message"}';
      const result = normalizeJsonEntries(data);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ label: "test", text: "message" });
    });

    it("should parse entries with smart quotes", () => {
      // The regex looks for surrounding braces {}
      const data = "{“label”: “Title”, “text”: “Value”}";
      const result = normalizeJsonEntries(data);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ label: "Title", text: "Value" });
    });

    it("should parse multiple entries", () => {
      const data = `
        { "label": "1", "text": "one" },
        { "label": "2", "text": "two" }
      `;
      const result = normalizeJsonEntries(data);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ label: "1", text: "one" });
      expect(result[1]).toEqual({ label: "2", text: "two" });
    });

    it("should handle mixed delimiters", () => {
      const data = `{'label': "mixed", "text": 'delimiters'}`;
      const result = normalizeJsonEntries(data);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ label: "mixed", text: "delimiters" });
    });

    it("should handle newlines in text", () => {
      const data = `{ "label": "multiline", "text": "line1\nline2" }`;
      const result = normalizeJsonEntries(data);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ label: "multiline", text: "line1\nline2" });
    });

    it("should ignore content outside of label/text structures", () => {
      const data = `some random text { "label": "valid", "text": "valid" } more text`;
      const result = normalizeJsonEntries(data);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ label: "valid", text: "valid" });
    });

    it("should handle internal quotes correctly", () => {
      // "text": "Don't"
      const data = `{ "label": "test", "text": "Don't worry" }`;
      const result = normalizeJsonEntries(data);
      expect(result[0].text).toBe("Don't worry");
    });
  });
});
