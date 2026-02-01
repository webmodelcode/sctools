import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FloatDropDown } from "../FloatDropDown";

describe("FloatDropDown.test", () => {
  const MockChildren = () => <span>Test</span>;

  beforeEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it("should render", () => {
    render(
      <FloatDropDown>
        <MockChildren />
      </FloatDropDown>,
    );

    const floatDropDown = screen.getByRole("accordion");
    const children = screen.getByText("Test");

    expect(floatDropDown).toBeInTheDocument();
    expect(children).toBeInTheDocument();
  });

  it("should render the button and the panel by default", () => {
    render(
      <FloatDropDown>
        <MockChildren />
      </FloatDropDown>,
    );

    const floatDropDown = screen.getByRole("accordion");
    const panel = screen.getByRole("dropdown-panel");

    expect(floatDropDown).toBeInTheDocument();
    expect(panel).toBeInTheDocument();
  });

  it("should render without classname", () => {
    render(
      <FloatDropDown>
        <MockChildren />
      </FloatDropDown>,
    );

    const floatDropDown = screen.getByRole("accordion");
    const className = floatDropDown.className;

    expect(floatDropDown).toBeInTheDocument();
    expect(className).toBe("flex items-center justify-center");
  });

  it("should render with classname", () => {
    render(
      <FloatDropDown className="custom-class">
        <MockChildren />
      </FloatDropDown>,
    );

    const floatDropDown = screen.getByRole("accordion");
    const className = floatDropDown.className;

    expect(floatDropDown).toBeInTheDocument();
    expect(className).toContain("custom-class");
  });

  it("should render with the correct rotation class for each direction", () => {
    const directionClasses = {
      top: "rotate-180",
      left: "rotate-90",
      right: "rotate-270",
      bottom: "rotate-0",
    };

    Object.entries(directionClasses).forEach(([direction, expectedClass]) => {
      const { unmount } = render(
        <FloatDropDown direction={direction as any}>
          <MockChildren />
        </FloatDropDown>,
      );

      const svg = screen.getByRole("trigger");
      expect(svg).toHaveClass(expectedClass);

      unmount();
    });
  });

  it("should render panel for default and hide it when clicked", async () => {
    render(
      <FloatDropDown>
        <MockChildren />
      </FloatDropDown>,
    );

    const floatDropDown = screen.getByRole("accordion");
    const panel = screen.getByRole("dropdown-panel");

    expect(floatDropDown).toBeInTheDocument();
    expect(panel).toBeInTheDocument();

    const trigger = screen.getByRole("trigger");

    fireEvent.click(trigger);

    await waitFor(() => {
      const hiddenPanel = screen.queryByRole("dropdown-panel");
      expect(hiddenPanel).not.toBeInTheDocument();
    });
  });
});
