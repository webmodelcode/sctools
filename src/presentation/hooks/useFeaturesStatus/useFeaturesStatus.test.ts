import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useFeaturesStatus } from "./useFeaturesStatus";

// Mock individual status hooks
const mockTranslator = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  watchItem: vi.fn(),
};
const mockQuickMessages = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  watchItem: vi.fn(),
};
const mockQuickMenu = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  watchItem: vi.fn(),
};
const mockSpeechToTranslateStatus = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  watchItem: vi.fn(),
};
const mockSpeechToTranslateTabId = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  watchItem: vi.fn(),
};
const mockSelectionTranslator = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  watchItem: vi.fn(),
};

vi.mock("../useTranslatorStatus/useTranslatorStatus", () => ({
  useTranslatorStatus: () => mockTranslator,
}));

vi.mock("../useQuickMessagesStatus/useQuickMessagesStatus", () => ({
  useQuickMessagesStatus: () => mockQuickMessages,
}));

vi.mock("../useQuickMenuIsActive/useQuickMenuIsActive", () => ({
  useQuickMenuIsActive: () => mockQuickMenu,
}));

vi.mock("../useSpeechToTranslateStatus/useSpeechToTranslateStatus", () => ({
  useSpeechToTranslateStatus: () => mockSpeechToTranslateStatus,
}));

vi.mock("../useSpeechToTranslateTabId/useSpeechToTranslateTabId", () => ({
  useSpeechToTranslateTabId: () => mockSpeechToTranslateTabId,
}));

vi.mock("../useSelectionTranslatorStatus/useSelectionTranslatorStatus", () => ({
  useSelectionTranslatorStatus: () => mockSelectionTranslator,
}));

describe("useFeaturesStatus Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    mockTranslator.getItem.mockResolvedValue(false);
    mockQuickMessages.getItem.mockResolvedValue(false);
    mockQuickMenu.getItem.mockResolvedValue(false);
    mockSpeechToTranslateStatus.getItem.mockResolvedValue(false);
    mockSpeechToTranslateTabId.getItem.mockResolvedValue(null);
    mockSelectionTranslator.getItem.mockResolvedValue(false);
  });

  it("should initialize with values from storage", async () => {
    mockTranslator.getItem.mockResolvedValue(true);
    mockQuickMessages.getItem.mockResolvedValue(false);
    mockQuickMenu.getItem.mockResolvedValue(true);

    const { result } = renderHook(() => useFeaturesStatus());

    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.translator.isEnabled).toBe(true);
      expect(result.current.quickMessages.isEnabled).toBe(false);
      expect(result.current.quickMenu.isEnabled).toBe(true);
    });
  });

  it("should toggle translator status", async () => {
    const { result } = renderHook(() => useFeaturesStatus());
    await waitFor(() => expect(result.current.isInitialized).toBe(true));

    await act(async () => {
      await result.current.translator.toggle(true);
    });

    expect(mockTranslator.setItem).toHaveBeenCalledWith(true);
    expect(result.current.translator.isEnabled).toBe(true);
  });

  it("should toggle quick messages status", async () => {
    const { result } = renderHook(() => useFeaturesStatus());
    await waitFor(() => expect(result.current.isInitialized).toBe(true));

    await act(async () => {
      await result.current.quickMessages.toggle(true);
    });

    expect(mockQuickMessages.setItem).toHaveBeenCalledWith(true);
    expect(result.current.quickMessages.isEnabled).toBe(true);
  });

  it("should toggle quick menu status", async () => {
    const { result } = renderHook(() => useFeaturesStatus());
    await waitFor(() => expect(result.current.isInitialized).toBe(true));

    await act(async () => {
      await result.current.quickMenu.toggle(true);
    });

    expect(mockQuickMenu.setItem).toHaveBeenCalledWith(true);
    expect(result.current.quickMenu.isEnabled).toBe(true);
  });

  it("should initialize selectionTranslator from storage", async () => {
    mockSelectionTranslator.getItem.mockResolvedValue(true);
    const { result } = renderHook(() => useFeaturesStatus());
    await waitFor(() => {
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.selectionTranslator.isEnabled).toBe(true);
    });
  });

  it("should toggle selectionTranslator status", async () => {
    const { result } = renderHook(() => useFeaturesStatus());
    await waitFor(() => expect(result.current.isInitialized).toBe(true));

    await act(async () => {
      await result.current.selectionTranslator.toggle(true);
    });

    expect(mockSelectionTranslator.setItem).toHaveBeenCalledWith(true);
    expect(result.current.selectionTranslator.isEnabled).toBe(true);
  });

  it("should update state when watched value changes", async () => {
    const { result } = renderHook(() => useFeaturesStatus());

    // Get the watch callback registered in useEffect
    // renderHook might trigger useEffect. We need to wait.
    await waitFor(() => expect(mockTranslator.watchItem).toHaveBeenCalled());

    const watchCallback = mockTranslator.watchItem.mock.calls[0][0];

    act(() => {
      watchCallback(true);
    });

    expect(result.current.translator.isEnabled).toBe(true);
  });
});
