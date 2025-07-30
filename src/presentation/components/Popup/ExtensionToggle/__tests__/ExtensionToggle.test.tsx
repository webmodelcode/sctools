import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExtensionToggle } from "../ExtensionToggle";
import { EXTENSION_TOGGLE } from "../ExtensionToggle.strings.json";

describe("ExtensionToggle Component", () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the label and switch correctly", () => {
    render(<ExtensionToggle isEnabled={false} onToggle={mockOnToggle} />);

    // Verify that the label renders
    expect(screen.getByText(EXTENSION_TOGGLE.LABEL)).toBeInTheDocument();

    // Verify that the switch renders
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("should reflect the enabled state correctly", () => {
    const { rerender } = render(
      <ExtensionToggle isEnabled={false} onToggle={mockOnToggle} />,
    );

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    // Re-render with enabled state
    rerender(<ExtensionToggle isEnabled={true} onToggle={mockOnToggle} />);
    expect(switchElement).toBeChecked();
  });

  it("should call onToggle when switch is clicked", () => {
    render(<ExtensionToggle isEnabled={false} onToggle={mockOnToggle} />);

    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  it("should have correct CSS structure", () => {
    render(<ExtensionToggle isEnabled={false} onToggle={mockOnToggle} />);

    const container = screen.getByText(EXTENSION_TOGGLE.LABEL).parentElement;
    expect(container).toHaveClass("flex", "items-center", "justify-center");

    const label = screen.getByText(EXTENSION_TOGGLE.LABEL);
    expect(label).toHaveClass("text-sm");
  });
});
