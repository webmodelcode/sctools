import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Popup } from "../Popup";

// Mock the useExtensionState hook
vi.mock("~@/presentation/hooks/useExtensionState/useExtensionState", () => ({
  useExtensionState: () => ({
    isQuickMenuEnabled: false,
    isInitialized: true,
    handleToggleExtension: vi.fn(),
  }),
}));

describe("Popup Component", () => {
  beforeEach(() => {
    // Mock chrome API
    browser.tabs.reload = vi.fn();
    vi.resetAllMocks();
  });

  it("should render all elements correctly", () => {
    render(<Popup />);

    // Verify that the header renders correctly
    expect(screen.getByText("ScTools")).toBeInTheDocument();
    expect(screen.getByText("by Estrellas Webcam")).toBeInTheDocument();
    
    // Verify that the extension toggle renders (now directly in Popup component)
    expect(screen.getByRole("switch")).toBeInTheDocument();
    
    // Verify that quick message operations render
    expect(screen.getByText("Quick Message Operations")).toBeInTheDocument();
  });

  it("should render with modular components structure", () => {
    render(<Popup />);
    
    // Verify that the modular structure is present using content as reference
    const titleElement = screen.getByText("ScTools");
    const card = titleElement.closest('[class*="min-h-[200px]"]');
    expect(card).toHaveClass("min-h-[200px]", "min-w-[350px]");
  });

  it("switch should be initially unchecked", () => {
    render(<Popup />);
    const switchElement = screen.getByRole("switch");
    
    expect(switchElement).not.toBeChecked();
  });
});
