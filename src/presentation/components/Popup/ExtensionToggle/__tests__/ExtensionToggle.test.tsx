import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExtensionToggle } from "../ExtensionToggle";
import { EXTENSION_TOGGLE } from "../ExtensionToggle.strings.json";

describe("ExtensionToggle Component", () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the feature name, status label and switch correctly", () => {
    render(
      <ExtensionToggle
        isEnabled={false}
        onToggle={mockOnToggle}
        featureName="Test Feature"
      />,
    );

    // Verify feature name
    expect(screen.getByText("Test Feature")).toBeInTheDocument();

    // Verify status label
    expect(screen.getByText(EXTENSION_TOGGLE.LABEL_OFF)).toBeInTheDocument();

    // Verify switch
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("should reflect the enabled state correctly", () => {
    const { rerender } = render(
      <ExtensionToggle
        isEnabled={false}
        onToggle={mockOnToggle}
        featureName="Test Feature"
      />,
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();
    expect(screen.getByText(EXTENSION_TOGGLE.LABEL_OFF)).toBeInTheDocument();

    // Re-render with enabled state
    rerender(
      <ExtensionToggle
        isEnabled={true}
        onToggle={mockOnToggle}
        featureName="Test Feature"
      />,
    );
    expect(switchElement).toBeChecked();
    expect(screen.getByText(EXTENSION_TOGGLE.LABEL_ON)).toBeInTheDocument();
  });

  it("should call onToggle when switch is clicked", () => {
    render(
      <ExtensionToggle
        isEnabled={false}
        onToggle={mockOnToggle}
        featureName="Test Feature"
      />,
    );

    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  it("should have correct CSS structure", () => {
    render(
      <ExtensionToggle
        isEnabled={false}
        onToggle={mockOnToggle}
        featureName="Test Feature"
      />,
    );

    // Outer container
    const featureLabel = screen.getByText("Test Feature");
    const outerContainer = featureLabel.closest(
      ".flex.items-center.justify-between",
    );
    expect(outerContainer).toBeInTheDocument();

    // Switch container
    const statusLabel = screen.getByText(EXTENSION_TOGGLE.LABEL_OFF);
    const switchContainer = statusLabel.parentElement;
    expect(switchContainer).toHaveClass("flex", "items-center", "gap-2");
  });
});
