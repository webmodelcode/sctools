import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickMessageOperations } from "../QuickMessageOperations";

describe("QuickMessageOperations Component", () => {
  it("should render the label correctly", () => {
    render(<QuickMessageOperations />);

    // Verify that the label renders
    expect(screen.getByText("Quick Message Operations")).toBeInTheDocument();
  });

  it("should render all quick message options", () => {
    render(<QuickMessageOperations />);

    // Verify that the options container exists
    const container = screen.getByText("Quick Message Operations").nextElementSibling;
    expect(container).toHaveClass("flex", "flex-row");
  });

  it("should have correct CSS structure", () => {
    render(<QuickMessageOperations />);

    const label = screen.getByText("Quick Message Operations");
    expect(label).toHaveClass("text-sm");
    
    const optionsContainer = label.nextElementSibling;
    expect(optionsContainer).toHaveClass("flex", "flex-row");
  });

  it("should render three quick message options", () => {
    render(<QuickMessageOperations />);

    // Verify that the three options are rendered (add, update, delete)
    // Note: This depends on how QuickMessageOptions is implemented
    // We assume each option renders some identifiable element
    const optionsContainer = screen.getByText("Quick Message Operations").nextElementSibling;
    expect(optionsContainer?.children).toHaveLength(3);
  });
});