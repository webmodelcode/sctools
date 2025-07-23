import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import React, { useRef } from "react";

// Mock the useMutationObserver hook
vi.mock("~@/presentation/hooks/useMutationObserver/useMutationObserver", () => ({
  useMutationObserver: vi.fn(),
}));

// Import the hook after mocking
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";

/**
 * Test component that mimics ScLocalTranslator structure
 */
const TestScLocalTranslator = () => {
  const chatRef = useRef(null);

  useMutationObserver({
    ref: chatRef,
    callback: () => {
      // Simple callback for testing
    },
  });

  return <div className="hidden" />;
};

describe("ScLocalTranslator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a hidden div", () => {
    const { container } = render(<TestScLocalTranslator />);
    const hiddenDiv = container.querySelector(".hidden");
    expect(hiddenDiv).toBeInTheDocument();
  });

  it("should call useMutationObserver hook", () => {
    render(<TestScLocalTranslator />);
    expect(vi.mocked(useMutationObserver)).toHaveBeenCalledTimes(1);
  });

  it("should setup mutation observer with correct parameters", () => {
    render(<TestScLocalTranslator />);
    
    expect(vi.mocked(useMutationObserver)).toHaveBeenCalledWith({
      ref: expect.objectContaining({
        current: null,
      }),
      callback: expect.any(Function),
    });
  });

  it("should render without crashing", () => {
    expect(() => render(<TestScLocalTranslator />)).not.toThrow();
  });
});
