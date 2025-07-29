import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PopupContent } from "../PopupContent";

describe("PopupContent Component", () => {
  const mockOnToggleExtension = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render ExtensionToggle and QuickMessageOperations", () => {
    render(
      <PopupContent
        isQuickMenuEnabled={false}
        onToggleExtension={mockOnToggleExtension}
      />
    );

    // Verify that ExtensionToggle renders
    expect(screen.getByText("Enable Extension")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
    
    // Verify that QuickMessageOperations renders
    expect(screen.getByText("Quick Message Operations")).toBeInTheDocument();
  });

  it("should pass correct props to ExtensionToggle", () => {
    const { rerender } = render(
      <PopupContent
        isQuickMenuEnabled={false}
        onToggleExtension={mockOnToggleExtension}
      />
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    // Re-render with enabled state
    rerender(
      <PopupContent
        isQuickMenuEnabled={true}
        onToggleExtension={mockOnToggleExtension}
      />
    );
    
    expect(switchElement).toBeChecked();
  });

  it("should have correct CSS structure", () => {
    render(
      <PopupContent
        isQuickMenuEnabled={false}
        onToggleExtension={mockOnToggleExtension}
      />
    );

    // Verify the CardContent structure
    const content = screen.getByText("Enable Extension").closest('[class*="p-4"]');
    expect(content).toBeInTheDocument();
    
    // Verify the inner container
    const innerContainer = screen.getByText("Enable Extension").closest('[class*="flex items-start justify-between gap-4 rounded-lg border p-3 shadow-sm"]');
    expect(innerContainer).toBeInTheDocument();
  });

  it("should render both components side by side", () => {
    render(
      <PopupContent
        isQuickMenuEnabled={false}
        onToggleExtension={mockOnToggleExtension}
      />
    );

    // Verify that both components are present
    const toggleSection = screen.getByText("Enable Extension");
    const operationsSection = screen.getByText("Quick Message Operations");
    
    expect(toggleSection).toBeInTheDocument();
    expect(operationsSection).toBeInTheDocument();
    
    // Verify that they are in the same container
    const container = toggleSection.closest('[class*="flex items-start justify-between"]');
    expect(container).toContainElement(operationsSection);
  });
});