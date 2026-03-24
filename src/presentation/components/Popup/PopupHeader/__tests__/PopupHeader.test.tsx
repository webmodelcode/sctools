import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PopupHeader } from "../PopupHeader";

describe("PopupHeader Component", () => {
  it("should render the logo and title correctly", () => {
    render(<PopupHeader />);

    expect(screen.getByText("Redna")).toBeInTheDocument();
    expect(screen.getByText("Models")).toBeInTheDocument();
    expect(screen.getByText("by Estrellas Webcam")).toBeInTheDocument();
  });

  it("should CardTitle have correct CSS classes", () => {
    const t = [
      "flex",
      "flex-col",
      "items-start",
      "justify-center",
      "text-sm",
      "font-bold",
    ];
    render(<PopupHeader />);

    const cardTitle = screen.getByTestId("popup-header-title");
    const classList = cardTitle.classList;
    expect(classList.length).toEqual(t.length);
    t.forEach((element) => {
      expect(classList).toContain(element);
    });
  });

  it("should render the EwLogo component", () => {
    render(<PopupHeader />);

    const logoContainer = screen.getByTestId("popup-header-logo-container");

    expect(logoContainer).toBeInTheDocument();
    expect(logoContainer).toHaveClass("flex", "items-end");
    expect(logoContainer.children.length).toBe(2);
    expect(logoContainer.children[0].tagName).toBe("svg");
    expect(logoContainer.children[0]).toHaveClass("h-12");
    expect(logoContainer.children[1].tagName).toBe("DIV");
    expect(logoContainer.children[1].children.length).toBe(2);
    expect(logoContainer.children[1].children[0].tagName).toBe("SPAN");
    expect(logoContainer.children[1].children[0]).toHaveClass("block");
    expect(logoContainer.children[1].children[0]).toHaveTextContent("Redna");
    expect(logoContainer.children[1].children[1].tagName).toBe("SPAN");
    expect(logoContainer.children[1].children[1]).toHaveTextContent("Models");
  });
});
