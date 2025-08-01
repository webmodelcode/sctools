/**
 * Tests for QuickMessageOptions utility functions
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  findQuickMessageIndex,
  createQuickMessageFromInputs,
  getTitleFromInput,
  isValidInput,
} from "../utils";
import { getQuickMessages } from "~@/infrastructure/datasource/quickMessages.local.datasource";

// Mock the datasource
vi.mock("~@/infrastructure/datasource/quickMessages.local.datasource", () => ({
  getQuickMessages: vi.fn(),
}));

const mockGetQuickMessages = vi.mocked(getQuickMessages);

describe("QuickMessageOptions Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findQuickMessageIndex", () => {
    it("should return correct index when message exists", async () => {
      const mockMessages = [
        { label: "greeting", text: "Hello!" },
        { label: "farewell", text: "Goodbye!" },
      ];
      mockGetQuickMessages.mockResolvedValue(mockMessages);

      const result = await findQuickMessageIndex("farewell");
      expect(result).toBe(1);
    });

    it("should return -1 when message does not exist", async () => {
      const mockMessages = [
        { label: "greeting", text: "Hello!" },
        { label: "farewell", text: "Goodbye!" },
      ];
      mockGetQuickMessages.mockResolvedValue(mockMessages);

      const result = await findQuickMessageIndex("nonexistent");
      expect(result).toBe(-1);
    });

    it("should return -1 when no messages exist", async () => {
      mockGetQuickMessages.mockResolvedValue([]);

      const result = await findQuickMessageIndex("any");
      expect(result).toBe(-1);
    });
  });

  describe("createQuickMessageFromInputs", () => {
    it("should create valid quick message from inputs", () => {
      const titleRef = {
        current: { value: "  Test Title  " } as HTMLInputElement,
      };
      const messageRef = {
        current: { value: "  Test Message  " } as HTMLInputElement,
      };

      const result = createQuickMessageFromInputs(titleRef, messageRef);
      
      expect(result).toEqual({
        label: "Test Title",
        text: "Test Message",
      });
    });

    it("should return null when title is empty", () => {
      const titleRef = {
        current: { value: "   " } as HTMLInputElement,
      };
      const messageRef = {
        current: { value: "Test Message" } as HTMLInputElement,
      };

      const result = createQuickMessageFromInputs(titleRef, messageRef);
      expect(result).toBeNull();
    });

    it("should return null when message is empty", () => {
      const titleRef = {
        current: { value: "Test Title" } as HTMLInputElement,
      };
      const messageRef = {
        current: { value: "   " } as HTMLInputElement,
      };

      const result = createQuickMessageFromInputs(titleRef, messageRef);
      expect(result).toBeNull();
    });

    it("should return null when titleRef.current is null", () => {
      const titleRef = { current: null };
      const messageRef = {
        current: { value: "Test Message" } as HTMLInputElement,
      };

      const result = createQuickMessageFromInputs(titleRef, messageRef);
      expect(result).toBeNull();
    });

    it("should return null when messageRef.current is null", () => {
      const titleRef = {
        current: { value: "Test Title" } as HTMLInputElement,
      };
      const messageRef = { current: null };

      const result = createQuickMessageFromInputs(titleRef, messageRef);
      expect(result).toBeNull();
    });
  });

  describe("getTitleFromInput", () => {
    it("should return trimmed title from input", () => {
      const titleRef = {
        current: { value: "  Test Title  " } as HTMLInputElement,
      };

      const result = getTitleFromInput(titleRef);
      expect(result).toBe("Test Title");
    });

    it("should return empty string when titleRef.current is null", () => {
      const titleRef = { current: null };

      const result = getTitleFromInput(titleRef);
      expect(result).toBe("");
    });

    it("should return empty string when value is undefined", () => {
      const titleRef = {
        current: { value: undefined } as any,
      };

      const result = getTitleFromInput(titleRef);
      expect(result).toBe("");
    });
  });

  describe("isValidInput", () => {
    it("should return true for valid non-empty string", () => {
      expect(isValidInput("valid input")).toBe(true);
      expect(isValidInput("a")).toBe(true);
    });

    it("should return false for empty string", () => {
      expect(isValidInput("")).toBe(false);
    });

    it("should return false for whitespace-only string", () => {
      expect(isValidInput("   ")).toBe(false);
      expect(isValidInput("\t\n")).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isValidInput(undefined as any)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isValidInput(null as any)).toBe(false);
    });
  });
});