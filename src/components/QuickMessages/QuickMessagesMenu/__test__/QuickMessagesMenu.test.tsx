import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { QuickMessagesMenu } from "../QuickMessagesMenu";

import { isEditableElement } from "@/config";

// Mock the isEditableElement function
vi.mock("@/config", () => ({
  isEditableElement: vi.fn(),
}));

describe("QuickMessagesMenu.tsx", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("should no render when isOpen is false", () => {
    render(<QuickMessagesMenu />);
    expect(screen.queryByRole("QuickMessagesMenu")).not.toBeInTheDocument();
  });

  it("should render component", () => {
    act(async () => {
      vi.mocked(isEditableElement).mockReturnValue(true);
      const { container } = render(<QuickMessagesMenu />);
      fireEvent(document, new Event("selectionchange"));

      const menuContainer = container.querySelector(".sct-fixed");
      const menu = await screen.findByRole("QuickMessagesMenu");

      expect(menuContainer).toBeInTheDocument();
      expect(menu).toBeInTheDocument();
      expect(menu.childElementCount).toBeGreaterThan(0);
    });
  });

  it("should close when a non-editable element is focused", () => {
    act(() => {
      // Mock isEditableElement to return false (non-editable element)
      vi.mocked(isEditableElement).mockReturnValue(false);

      // Render the component
      render(<QuickMessagesMenu />);

      // Simulate the selectionchange event
      fireEvent(document, new Event("selectionchange"));

      // Check if the component is not visible
      const quickMessagesMenu = screen.queryByRole("QuickMessagesMenu");
      expect(quickMessagesMenu).not.toBeInTheDocument();
    });
  });
});
