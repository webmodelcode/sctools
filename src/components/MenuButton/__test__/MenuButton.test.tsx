import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { MenuButton } from "../MenuButton";

const variants = {
  active: "outline",
  noActive: "ghost",
};

const MockIconText = "Test Icon";
const MockIcon = () => <div>{MockIconText}</div>;
const mockClick = vi.fn();
const mockTitle = "Test Title";

describe("MenuButton", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    render(
      <MenuButton
        ButtonIcon={<MockIcon />}
        onClick={mockClick}
        title={mockTitle}
      />
    );
  });

  it("should render and display the button", () => {
    const button = screen.getByRole("menuButton");
    expect(button).toBeInTheDocument();
    expect(button.firstChild).toHaveTextContent(MockIconText);
    expect(button.className).include(variants.noActive);

    fireEvent.mouseUp(button);
    setTimeout(() => {
      const tooltip = screen.getByText(mockTitle);
      expect(tooltip).toBeInTheDocument();
    }, 50);
  });

  it("should execute click event", () => {
    const button = screen.getByRole("menuButton");
    act(() => {
      fireEvent.click(button);
      expect(mockClick).toBeCalledTimes(1);
      expect(button.className).include(variants.active);
    });
    act(() => {
      fireEvent.click(button);
      expect(mockClick).toBeCalledTimes(2);
      setTimeout(() => {
        expect(button.className).include(variants.noActive);
      }, 50);
    });
  });
});
