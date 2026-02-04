/**
 * Tests for useImportForm hook
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useImportForm } from "../useImportForm";
import {
  getQuickMessages,
  addQuickMessage,
} from "~@/infrastructure/datasource/quickMessages.local.datasource";
import { IMPORT_FORM } from "../../quickMessageOptions.strings.json";

// Mock the datasource
vi.mock("~@/infrastructure/datasource/quickMessages.local.datasource", () => ({
  getQuickMessages: vi.fn(),
  addQuickMessage: vi.fn(),
}));

const mockGetQuickMessages = vi.mocked(getQuickMessages);
const mockAddQuickMessage = vi.mocked(addQuickMessage);

describe("useImportForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetQuickMessages.mockResolvedValue([]);
    mockAddQuickMessage.mockResolvedValue();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useImportForm({}));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("");
    expect(result.current.success).toBe(false);
  });

  it("should handle successful import", async () => {
    const { result } = renderHook(() =>
      useImportForm({ onSuccess: mockOnSuccess, onError: mockOnError }),
    );

    const validJson = JSON.stringify([{ label: "test", text: "message" }]);

    await act(async () => {
      await result.current.onSubmit({ jsonData: validJson });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBe("");
    expect(mockAddQuickMessage).toHaveBeenCalledWith({
      label: "test",
      text: "message",
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should handle empty input", async () => {
    const { result } = renderHook(() =>
      useImportForm({ onSuccess: mockOnSuccess, onError: mockOnError }),
    );

    await act(async () => {
      // @ts-ignore - Check what happens if trim fails or empty string passed manually
      await result.current.onSubmit({ jsonData: "   " });
    });

    expect(result.current.error).toBe(IMPORT_FORM.FORM_VALIDATION_MSG.REQUIRED);
    expect(mockOnError).toHaveBeenCalledWith(
      IMPORT_FORM.FORM_VALIDATION_MSG.REQUIRED,
    );
  });

  it("should handle invalid format (no entries found)", async () => {
    const { result } = renderHook(() =>
      useImportForm({ onSuccess: mockOnSuccess, onError: mockOnError }),
    );

    await act(async () => {
      await result.current.onSubmit({ jsonData: "invalid json string" });
    });

    expect(result.current.error).toBe(
      IMPORT_FORM.FORM_VALIDATION_MSG.INVALID_FORMAT,
    );
  });

  it("should skip existing messages", async () => {
    mockGetQuickMessages.mockResolvedValue([
      { label: "existing", text: "old" },
    ]);

    const { result } = renderHook(() =>
      useImportForm({ onSuccess: mockOnSuccess }),
    );

    const input = JSON.stringify([
      { label: "existing", text: "new content" }, // Should be skipped
      { label: "new", text: "new content" },
    ]);

    await act(async () => {
      await result.current.onSubmit({ jsonData: input });
    });

    expect(mockAddQuickMessage).toHaveBeenCalledTimes(1);
    expect(mockAddQuickMessage).toHaveBeenCalledWith({
      label: "new",
      text: "new content",
    });
  });
});
