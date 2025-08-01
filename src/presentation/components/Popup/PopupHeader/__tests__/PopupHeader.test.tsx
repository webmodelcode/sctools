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
    const cardHeader = titleElement.closest('[class*="flex flex-row items-center justify-around space-y-0 p-3"]');
    expect(cardHeader).toBeInTheDocument();
    expect(cardHeader).toHaveClass("flex", "flex-row", "items-center", "justify-around", "space-y-0", "p-3");
  });

  it("should render the EwLogo component", () => {
    render(<PopupHeader />);
    
    // Verify that the logo is present (assuming EwLogo renders an element with role img or similar)
    const logoContainer = screen.getByText("ScTools").parentElement;
    expect(logoContainer).toHaveClass("text-2xl", "font-bold");
  });
});