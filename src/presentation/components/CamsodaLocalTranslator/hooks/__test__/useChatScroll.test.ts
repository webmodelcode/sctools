import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChatScroll } from "../useChatScroll";

describe("useChatScroll", () => {
  const scrollToBottomMock = vi.fn();
  const scrollRefMock = {
    current: {
      scrollToBottom: scrollToBottomMock,
      scrollToTop: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useChatScroll([]));

    expect(result.current.scrollRef.current).toBeNull();
    expect(result.current.showScrollBottomButton).toBe(false);
  });

  it("should NOT auto-scroll to bottom on first non-empty message load", () => {
    const { result, rerender } = renderHook(({ msgs }) => useChatScroll(msgs), {
      initialProps: { msgs: [] as string[] },
    });

    // Assign ref
    // @ts-ignore
    result.current.scrollRef.current = scrollRefMock.current;

    // Update messages
    rerender({ msgs: ["msg1"] });

    expect(scrollToBottomMock).not.toHaveBeenCalled();
  });

  it("should show new message button if not at bottom", () => {
    const { result, rerender } = renderHook(({ msgs }) => useChatScroll(msgs), {
      initialProps: { msgs: ["msg1"] as string[] },
    });

    // @ts-ignore
    result.current.scrollRef.current = scrollRefMock.current;

    // Simulate user scrolling up
    act(() => {
      result.current.handleScrollStateChange({ canScrollDown: true });
    });

    // New message comes
    rerender({ msgs: ["msg1", "msg2"] });

    expect(result.current.showScrollBottomButton).toBe(true);
  });

  it("should not show button if at bottom, but should NOT auto-scroll", () => {
    const { result, rerender } = renderHook(({ msgs }) => useChatScroll(msgs), {
      initialProps: { msgs: ["msg1"] as string[] },
    });

    // @ts-ignore
    result.current.scrollRef.current = scrollRefMock.current;

    // At bottom
    act(() => {
      result.current.handleScrollStateChange({ canScrollDown: false });
    });

    rerender({ msgs: ["msg1", "msg2"] });

    expect(result.current.showScrollBottomButton).toBe(false);
    expect(scrollToBottomMock).not.toHaveBeenCalled(); // Should NOT scroll to bottom automatically
  });

  it("scrollToBottom helper should call ref method", () => {
    const { result } = renderHook(() => useChatScroll([]));
    // @ts-ignore
    result.current.scrollRef.current = scrollRefMock.current;

    act(() => {
      result.current.scrollToBottom();
    });

    expect(scrollToBottomMock).toHaveBeenCalled();
  });
});
