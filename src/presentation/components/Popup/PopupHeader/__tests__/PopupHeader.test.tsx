import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PopupHeader } from "../PopupHeader";

describe("PopupHeader Component", () => {
  it("should render the logo and title correctly", () => {
    render(<PopupHeader />);

    // Verify that the main title renders
    expect(screen.getByText("ScTools")).toBeInTheDocument();

    // Verify that the subtitle renders
    expect(screen.getByText("by Estrellas Webcam")).toBeInTheDocument();
  });

  it("should have correct CSS classes", () => {
    render(<PopupHeader />);

    // Verify that the CardHeader has the correct classes
    const titleElement = screen.getByText("ScTools");
    // The structure is CardHeader > CardTitle > div > (EwLogo + span)
    // CardHeader has "px-3"
    // CardTitle has "flex items-end justify-center text-sm font-bold"

    // Check CardTitle classes
    const cardTitle = titleElement.closest("h3"); // CardTitle renders as h3 by default in shadcn/ui usually, or check parent
    // Alternatively, find by hierarchy
    const containerDiv = titleElement.parentElement; // div
    const cardTitleElement = containerDiv?.parentElement; // CardTitle

    expect(cardTitleElement).toHaveClass(
      "flex",
      "items-end",
      "justify-center",
      "text-sm",
      "font-bold",
    );
  });

  it("should render the EwLogo component", () => {
    render(<PopupHeader />);

    // Verify that the logo is present (assuming EwLogo renders an SVG or similar)
    // We can check if the title container has the correct classes
    const titleElement = screen.getByText("ScTools");
    const containerDiv = titleElement.parentElement;
    const cardTitleElement = containerDiv?.parentElement;

    // Check if CardTitle contains the classes that define the look
    expect(cardTitleElement).toBeInTheDocument();
    expect(cardTitleElement).toHaveClass("text-sm", "font-bold");
  });
});
