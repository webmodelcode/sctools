import { describe, expect, it } from "vitest";
import { TranslatedMessage } from "../TranslatedMessage";
import { render } from "@testing-library/react";

describe("TranslatedMessage", () => {
  it("should render", () => {
    const { container } = render(
      <TranslatedMessage message="Hello" bgColor="red" />,
    );
    expect(container).toBeInTheDocument();
  });

  it("should have correct background color", () => {
    const { container } = render(
      <TranslatedMessage message="Hello" bgColor="red" />,
    );
    const div = container.querySelector("div");
    expect(div).toHaveStyle({ backgroundColor: "red" });
  });

  it("should have correct message", () => {
    const { container } = render(
      <TranslatedMessage message="Hello" bgColor="red" />,
    );
    const span = container.querySelector("span");
    expect(span).toHaveTextContent("Hello");
  });

  it("should have correct icon", () => {
    const { container } = render(
      <TranslatedMessage message="Hello" bgColor="red" />,
    );
    expect(container).toHaveTextContent("🌐");
  });
});
