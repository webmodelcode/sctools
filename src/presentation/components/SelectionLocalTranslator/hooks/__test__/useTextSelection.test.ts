import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useTextSelection } from "../useTextSelection";

const mockGetBoundingClientRect = vi.fn(() => ({
  top: 100,
  left: 50,
  width: 200,
  height: 20,
  right: 250,
  bottom: 120,
  x: 50,
  y: 100,
  toJSON: () => ({}),
}));

const mockRange = {
  getBoundingClientRect: mockGetBoundingClientRect,
};

const mockSelection = {
  rangeCount: 1,
  toString: vi.fn(),
  getRangeAt: vi.fn(() => mockRange),
};

const triggerSelectionChange = () => {
  document.dispatchEvent(new Event("selectionchange"));
};

describe("useTextSelection", () => {
  beforeEach(() => {
    vi.spyOn(document, "getSelection").mockReturnValue(
      mockSelection as unknown as Selection,
    );
    mockSelection.toString.mockReturnValue("");
    mockSelection.rangeCount = 1;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should start with null selection", () => {
    const { result } = renderHook(() => useTextSelection());
    expect(result.current.selection).toBeNull();
  });

  it("should set selection when text has ≥3 chars", () => {
    mockSelection.toString.mockReturnValue("hello world");

    const { result } = renderHook(() => useTextSelection());

    act(() => {
      triggerSelectionChange();
    });

    expect(result.current.selection).not.toBeNull();
    expect(result.current.selection?.text).toBe("hello world");
    expect(result.current.selection?.rect).toBeDefined();
  });

  it("should NOT set selection when text is exactly 2 chars", () => {
    mockSelection.toString.mockReturnValue("ab");

    const { result } = renderHook(() => useTextSelection());

    act(() => {
      triggerSelectionChange();
    });

    expect(result.current.selection).toBeNull();
  });

  it("should NOT set selection when text is only whitespace", () => {
    mockSelection.toString.mockReturnValue("   ");

    const { result } = renderHook(() => useTextSelection());

    act(() => {
      triggerSelectionChange();
    });

    expect(result.current.selection).toBeNull();
  });

  it("should NOT set selection when text has <3 non-whitespace chars with surrounding spaces", () => {
    mockSelection.toString.mockReturnValue("  a  ");

    const { result } = renderHook(() => useTextSelection());

    act(() => {
      triggerSelectionChange();
    });

    expect(result.current.selection).toBeNull();
  });

  it("should NOT clear selection on scroll", () => {
    mockSelection.toString.mockReturnValue("hello world");

    const { result } = renderHook(() => useTextSelection());

    act(() => {
      triggerSelectionChange();
    });

    expect(result.current.selection).not.toBeNull();

    act(() => {
      document.dispatchEvent(new Event("scroll", { bubbles: true }));
    });

    expect(result.current.selection).not.toBeNull();
  });

  it("clearSelection sets selection to null", () => {
    mockSelection.toString.mockReturnValue("hello world");

    const { result } = renderHook(() => useTextSelection());

    act(() => {
      triggerSelectionChange();
    });

    expect(result.current.selection).not.toBeNull();

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selection).toBeNull();
  });

  it("should set selection to null when getSelection returns null", () => {
    vi.spyOn(document, "getSelection").mockReturnValue(null);

    const { result } = renderHook(() => useTextSelection());

    act(() => {
      triggerSelectionChange();
    });

    expect(result.current.selection).toBeNull();
  });

  it("should set selection to null when rangeCount is 0", () => {
    mockSelection.rangeCount = 0;

    const { result } = renderHook(() => useTextSelection());

    act(() => {
      triggerSelectionChange();
    });

    expect(result.current.selection).toBeNull();
  });

  it("should remove event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useTextSelection());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "selectionchange",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseup",
      expect.any(Function),
    );
  });
});
