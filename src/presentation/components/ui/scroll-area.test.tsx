import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { ScrollArea, ScrollAreaRef } from "./scroll-area";

describe("ScrollArea", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    globalThis.ResizeObserver = class ResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };
  });

  it("renders children correctly", () => {
    render(
      <ScrollArea>
        <div>Test Content</div>
      </ScrollArea>,
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("exposes scrollToTop and scrollToBottom methods via ref", () => {
    const ref = React.createRef<ScrollAreaRef>();
    render(
      <ScrollArea ref={ref}>
        <div style={{ height: "200px" }}>Long Content</div>
      </ScrollArea>,
    );

    expect(ref.current).toHaveProperty("scrollToTop");
    expect(ref.current).toHaveProperty("scrollToBottom");
  });

  it("calls scrollToTop on underlying viewport", () => {
    const ref = React.createRef<ScrollAreaRef>();
    const { container } = render(
      <ScrollArea ref={ref}>
        <div style={{ height: "500px" }}>Content</div>
      </ScrollArea>,
    );

    // Mock scrollTo on the viewport element
    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement;
    if (!viewport) throw new Error("Viewport not found");
    viewport.scrollTo = vi.fn();

    ref.current?.scrollToTop();

    expect(viewport.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("calls scrollToBottom on underlying viewport", () => {
    const ref = React.createRef<ScrollAreaRef>();
    const { container } = render(
      <ScrollArea ref={ref}>
        <div style={{ height: "500px" }}>Content</div>
      </ScrollArea>,
    );

    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement;
    if (!viewport) throw new Error("Viewport not found");
    // Mock scrollHeight
    Object.defineProperty(viewport, "scrollHeight", {
      value: 1000,
      configurable: true,
    });
    viewport.scrollTo = vi.fn();

    ref.current?.scrollToBottom();

    expect(viewport.scrollTo).toHaveBeenCalledWith({
      top: 1000,
      behavior: "smooth",
    });
  });

  it("triggers onScrollStateChange when scrolled", () => {
    const onScrollStateChange = vi.fn();
    const { container } = render(
      <ScrollArea
        onScrollStateChange={onScrollStateChange}
        style={{ height: "100px" }}
      >
        <div style={{ height: "500px" }}>Content</div>
      </ScrollArea>,
    );

    const viewport = container.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLElement;
    if (!viewport) throw new Error("Viewport not found");

    // Setup dimensions for the mock
    Object.defineProperty(viewport, "scrollHeight", {
      value: 500,
      configurable: true,
    });
    Object.defineProperty(viewport, "clientHeight", { value: 100 });
    Object.defineProperty(viewport, "scrollTop", {
      value: 0,
      configurable: true,
      writable: true,
    });

    // Initial check (triggered by useEffect)
    // Note: useEffect might run before we set up properties if we rely on real layout,
    // but here we are controlling props. The initial useEffect call uses *current* values.
    // In jsdom/happydom, layout properties are usually 0.
    // We can simulate a scroll event to trigger the check manually if the initial load didn't catch our mocks.

    // Simulate scroll down
    // Update scrollTop
    Object.defineProperty(viewport, "scrollTop", {
      value: 50,
      configurable: true,
      writable: true,
    });
    fireEvent.scroll(viewport);

    expect(onScrollStateChange).toHaveBeenCalledWith({
      canScrollUp: true,
      canScrollDown: true,
    });

    // Simulate scroll to bottom
    Object.defineProperty(viewport, "scrollTop", {
      value: 398,
      configurable: true,
      writable: true,
    }); // 399 + 100 = 499 < 500. canScrollDown = true
    fireEvent.scroll(viewport);
    expect(onScrollStateChange).toHaveBeenLastCalledWith({
      canScrollUp: true,
      canScrollDown: true,
    }); // Depending on Math.ceil logic

    Object.defineProperty(viewport, "scrollTop", {
      value: 400,
      configurable: true,
      writable: true,
    });
    fireEvent.scroll(viewport);
    expect(onScrollStateChange).toHaveBeenLastCalledWith({
      canScrollUp: true,
      canScrollDown: false,
    });
  });
});
