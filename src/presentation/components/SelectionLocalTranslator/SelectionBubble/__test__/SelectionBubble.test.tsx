import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectionBubble } from "../SelectionBubble";

const makeRect = (overrides: Partial<DOMRect> = {}): DOMRect => ({
  top: 100,
  left: 50,
  width: 200,
  height: 20,
  right: 250,
  bottom: 120,
  x: 50,
  y: 100,
  toJSON: () => ({}),
  ...overrides,
});

describe("SelectionBubble", () => {
  it("renders with valid rect", () => {
    render(<SelectionBubble rect={makeRect()} onHover={vi.fn()} />);
    expect(screen.getByTestId("selection-bubble-button")).toBeInTheDocument();
  });

  it("positions bubble above center of selection", () => {
    const rect = makeRect({ top: 200, left: 100, width: 300 });
    render(<SelectionBubble rect={rect} onHover={vi.fn()} />);
    const bubble = screen.getByTestId("selection-bubble-button");
    expect(bubble.style.top).toBe("164px"); // 200 - 36
    expect(bubble.style.left).toBe("236px"); // 100 + 300/2 - 14
  });

  it("calls onHover on mouseenter", () => {
    const onHover = vi.fn();
    render(<SelectionBubble rect={makeRect()} onHover={onHover} />);
    fireEvent.mouseEnter(screen.getByTestId("selection-bubble-button"));
    expect(onHover).toHaveBeenCalledTimes(1);
  });

  it("does not call onHover without mouseenter", () => {
    const onHover = vi.fn();
    render(<SelectionBubble rect={makeRect()} onHover={onHover} />);
    expect(onHover).not.toHaveBeenCalled();
  });

  it("renders EwLogo inside bubble", () => {
    render(<SelectionBubble rect={makeRect()} onHover={vi.fn()} />);
    const bubble = screen.getByTestId("selection-bubble-button");
    expect(bubble.querySelector("svg")).not.toBeNull();
  });
});
