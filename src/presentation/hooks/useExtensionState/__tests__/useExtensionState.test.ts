import { renderHook, act, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useExtensionState } from "../useExtensionState";

// Mock the useQuickMenuIsActive hook
const mockGetItem = vi.fn();
const mockSetItem = vi.fn();

vi.mock("~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive", () => ({
  useQuickMenuIsActive: () => ({
    getItem: mockGetItem,
    setItem: mockSetItem,
  }),
}));

describe("useExtensionState Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem.mockResolvedValue(false);
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useExtensionState());

    expect(result.current.isQuickMenuEnabled).toBe(false);
    expect(result.current.isInitialized).toBe(false);
    expect(typeof result.current.handleToggleExtension).toBe("function");
  });

  it("should initialize state from storage", async () => {
    mockGetItem.mockResolvedValue(true);
    
    const { result } = renderHook(() => useExtensionState());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    expect(result.current.isQuickMenuEnabled).toBe(true);
    expect(mockGetItem).toHaveBeenCalledTimes(1);
  });

  it("should handle toggle extension correctly", async () => {
    const { result } = renderHook(() => useExtensionState());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    await act(async () => {
      await result.current.handleToggleExtension(true);
    });

    expect(mockSetItem).toHaveBeenCalledWith(true);
    expect(result.current.isQuickMenuEnabled).toBe(true);
  });

  it("should handle multiple toggle calls", async () => {
    const { result } = renderHook(() => useExtensionState());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    // Enable
    await act(async () => {
      await result.current.handleToggleExtension(true);
    });

    expect(result.current.isQuickMenuEnabled).toBe(true);
    expect(mockSetItem).toHaveBeenCalledWith(true);

    // Disable
    await act(async () => {
      await result.current.handleToggleExtension(false);
    });

    expect(result.current.isQuickMenuEnabled).toBe(false);
    expect(mockSetItem).toHaveBeenCalledWith(false);
    expect(mockSetItem).toHaveBeenCalledTimes(2);
  });

  it("should not initialize twice", async () => {
    const { result, rerender } = renderHook(() => useExtensionState());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
    });

    const initialCallCount = mockGetItem.mock.calls.length;

    // Re-render the hook
    rerender();

    // Wait a bit to ensure it doesn't get called again
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockGetItem).toHaveBeenCalledTimes(initialCallCount);
  });
});