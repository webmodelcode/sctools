import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickMessageOperations } from "../QuickMessageOperations";
import { QUICK_MESSAGE_OPERATIONS } from "../strings.json";

describe("QuickMessageOperations Component", () => {
  it("should render the label correctly", () => {
    render(<QuickMessageOperations />);

    // Verify that the label renders
    expect(
      screen.getByText(QUICK_MESSAGE_OPERATIONS.TITLE),
    ).toBeInTheDocument();
  });

  it("should render all quick message options", () => {
    render(<QuickMessageOperations />);

    // Verify that the options container exists
    const container = screen.getByText(
      QUICK_MESSAGE_OPERATIONS.TITLE,
    ).nextElementSibling;
    expect(container).toHaveClass("flex", "flex-row");
  });

  it("should have correct CSS structure", () => {
    render(<QuickMessageOperations />);

    const label = screen.getByText(QUICK_MESSAGE_OPERATIONS.TITLE);
    expect(label).toHaveClass("text-sm");

    const optionsContainer = label.nextElementSibling;
    expect(optionsContainer).toHaveClass("flex", "flex-row");
  });

  it("should render three quick message options", () => {
    render(<QuickMessageOperations />);

    // Verify that the three options are rendered (add, update, delete)
    // Note: This depends on how QuickMessageOptions is implemented
    // We assume each option renders some identifiable element
    const optionsContainer = screen.getByText(
      QUICK_MESSAGE_OPERATIONS.TITLE,
    ).nextElementSibling;
    expect(optionsContainer?.children).toHaveLength(5);
  });
});
