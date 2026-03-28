import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TranslatedMessage } from "../TranslatedMessage";

describe("TranslatedMessage", () => {
  const message = "Hola mundo";

  it("renders the translated message", () => {
    render(<TranslatedMessage message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("displays the EW logo image", () => {
    render(<TranslatedMessage message={message} />);
    const img = screen.getByAltText("estrellas webcam");
    expect(img).toBeInTheDocument();
    expect(img).toHaveStyle({ width: "25px", height: "25px" });
  });

  it("applies the correct container styles", () => {
    render(<TranslatedMessage message={message} />);
    const container = screen.getByTestId("translated-message-container");
    expect(container).toHaveStyle({
      backgroundColor: "oklch(0.269 0 0)",
      border: "2px solid oklch(0.8 0.15 70)",
      borderRadius: "4px",
      color: "white",
      display: "flex",
      alignItems: "center",
    });
  });
});
