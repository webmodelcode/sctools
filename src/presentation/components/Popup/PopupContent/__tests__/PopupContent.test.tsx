import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PopupContent } from "../PopupContent";

describe("PopupContent Component", () => {
  it("should render QuickMessageOperations correctly", () => {
    render(<PopupContent />);

    // Verify that QuickMessageOperations renders
    expect(screen.getByText("Quick Message Operations")).toBeInTheDocument();
  });

  it("should have correct CSS structure", () => {
    render(<PopupContent />);

    // Verify the CardContent structure
    const content = screen.getByText("Quick Message Operations").closest('[class*="p-4"]');
    expect(content).toBeInTheDocument();
    
    // Verify the inner container
    const innerContainer = screen.getByText("Quick Message Operations").closest('[class*="flex items-center justify-center gap-4 rounded-lg border p-3 shadow-sm"]');
    expect(innerContainer).toBeInTheDocument();
  });

  it("should render with centered layout", () => {
    render(<PopupContent />);

    // Verify that the container has centered layout classes
    const operationsSection = screen.getByText("Quick Message Operations");
    const container = operationsSection.closest('[class*="flex items-center justify-center"]');
    
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("flex", "items-center", "justify-center", "gap-4", "rounded-lg", "border", "p-3", "shadow-sm");
  });
});