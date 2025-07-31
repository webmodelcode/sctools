/**
 * Tests for QuickMessageOptions handler functions
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  handleAddMessage,
  handleUpdateMessage,
  handleDeleteMessage,
} from "../handlers";
import {
  getQuickMessages,
  addQuickMessage,
  updateQuickMessage,
  deleteQuickMessage,
} from "~@/infrastructure/datasource/quickMessages.local.datasource";
import { ERROR_MESSAGES } from "../types";

// Mock the datasource
vi.mock("~@/infrastructure/datasource/quickMessages.local.datasource", () => ({
  getQuickMessages: vi.fn(),
  addQuickMessage: vi.fn(),
  updateQuickMessage: vi.fn(),
  deleteQuickMessage: vi.fn(),
}));

const mockGetQuickMessages = vi.mocked(getQuickMessages);
const mockAddQuickMessage = vi.mocked(addQuickMessage);
const mockUpdateQuickMessage = vi.mocked(updateQuickMessage);
const mockDeleteQuickMessage = vi.mocked(deleteQuickMessage);

describe("QuickMessageOptions Handlers", () => {
  let mockSetErrorMsg: ReturnType<typeof vi.fn>;
  let mockSetIsOpen: ReturnType<typeof vi.fn>;
  let titleRef: React.RefObject<HTMLInputElement | null>;
  let messageRef: React.RefObject<HTMLInputElement | null>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetErrorMsg = vi.fn();
    mockSetIsOpen = vi.fn();
    
    titleRef = {
      current: { value: "Test Title" } as HTMLInputElement,
    };
    messageRef = {
      current: { value: "Test Message" } as HTMLInputElement,
    };
  });

  describe("handleAddMessage", () => {
    it("should add message successfully when inputs are valid and message doesn't exist", async () => {
      mockGetQuickMessages.mockResolvedValue([]);
      mockAddQuickMessage.mockResolvedValue(undefined);

      await handleAddMessage(titleRef, messageRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockAddQuickMessage).toHaveBeenCalledWith({
        label: "Test Title",
        text: "Test Message",
      });
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      expect(mockSetErrorMsg).not.toHaveBeenCalled();
    });

    it("should set error when inputs are invalid", async () => {
      titleRef.current!.value = "";

      await handleAddMessage(titleRef, messageRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockSetErrorMsg).toHaveBeenCalledWith(ERROR_MESSAGES.INVALID_INPUT);
      expect(mockAddQuickMessage).not.toHaveBeenCalled();
      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });

    it("should set error when message already exists", async () => {
      const existingMessages = [
        { label: "Test Title", text: "Existing message" },
      ];
      mockGetQuickMessages.mockResolvedValue(existingMessages);

      await handleAddMessage(titleRef, messageRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockSetErrorMsg).toHaveBeenCalledWith(
        ERROR_MESSAGES.ALREADY_EXISTS("Test Title")
      );
      expect(mockAddQuickMessage).not.toHaveBeenCalled();
      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });
  });

  describe("handleUpdateMessage", () => {
    it("should update message successfully when inputs are valid and message exists", async () => {
      const existingMessages = [
        { label: "Test Title", text: "Old message" },
      ];
      mockGetQuickMessages.mockResolvedValue(existingMessages);
      mockUpdateQuickMessage.mockResolvedValue(undefined);

      await handleUpdateMessage(titleRef, messageRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockUpdateQuickMessage).toHaveBeenCalledWith(0, {
        label: "Test Title",
        text: "Test Message",
      });
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      expect(mockSetErrorMsg).not.toHaveBeenCalled();
    });

    it("should set error when inputs are invalid", async () => {
      messageRef.current!.value = "";

      await handleUpdateMessage(titleRef, messageRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockSetErrorMsg).toHaveBeenCalledWith(ERROR_MESSAGES.INVALID_INPUT);
      expect(mockUpdateQuickMessage).not.toHaveBeenCalled();
      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });

    it("should set error when message does not exist", async () => {
      mockGetQuickMessages.mockResolvedValue([]);

      await handleUpdateMessage(titleRef, messageRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockSetErrorMsg).toHaveBeenCalledWith(
        ERROR_MESSAGES.NOT_EXISTS("Test Title")
      );
      expect(mockUpdateQuickMessage).not.toHaveBeenCalled();
      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });
  });

  describe("handleDeleteMessage", () => {
    it("should delete message successfully when title is valid and message exists", async () => {
      const existingMessages = [
        { label: "Test Title", text: "Message to delete" },
      ];
      mockGetQuickMessages.mockResolvedValue(existingMessages);
      mockDeleteQuickMessage.mockResolvedValue(undefined);

      await handleDeleteMessage(titleRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockDeleteQuickMessage).toHaveBeenCalledWith(0);
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
      expect(mockSetErrorMsg).not.toHaveBeenCalled();
    });

    it("should set error when title is invalid", async () => {
      titleRef.current!.value = "";

      await handleDeleteMessage(titleRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockSetErrorMsg).toHaveBeenCalledWith(ERROR_MESSAGES.INVALID_INPUT);
      expect(mockDeleteQuickMessage).not.toHaveBeenCalled();
      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });

    it("should set error when message does not exist", async () => {
      mockGetQuickMessages.mockResolvedValue([]);

      await handleDeleteMessage(titleRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockSetErrorMsg).toHaveBeenCalledWith(
        ERROR_MESSAGES.DELETE_NOT_FOUND("Test Title")
      );
      expect(mockDeleteQuickMessage).not.toHaveBeenCalled();
      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });

    it("should handle null titleRef.current", async () => {
      titleRef = { current: null };

      await handleDeleteMessage(titleRef, mockSetErrorMsg, mockSetIsOpen);

      expect(mockSetErrorMsg).toHaveBeenCalledWith(ERROR_MESSAGES.INVALID_INPUT);
      expect(mockDeleteQuickMessage).not.toHaveBeenCalled();
      expect(mockSetIsOpen).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should handle datasource errors gracefully in handleAddMessage", async () => {
      mockGetQuickMessages.mockRejectedValue(new Error("Database error"));

      await expect(
        handleAddMessage(titleRef, messageRef, mockSetErrorMsg, mockSetIsOpen)
      ).rejects.toThrow("Database error");
    });

    it("should handle datasource errors gracefully in handleUpdateMessage", async () => {
      mockGetQuickMessages.mockRejectedValue(new Error("Database error"));

      await expect(
        handleUpdateMessage(titleRef, messageRef, mockSetErrorMsg, mockSetIsOpen)
      ).rejects.toThrow("Database error");
    });

    it("should handle datasource errors gracefully in handleDeleteMessage", async () => {
      mockGetQuickMessages.mockRejectedValue(new Error("Database error"));

      await expect(
        handleDeleteMessage(titleRef, mockSetErrorMsg, mockSetIsOpen)
      ).rejects.toThrow("Database error");
    });
  });
});