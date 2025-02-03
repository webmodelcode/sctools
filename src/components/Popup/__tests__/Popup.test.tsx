import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Popup } from "../Popup";

describe("Popup Component", () => {
  beforeEach(() => {
    // Mock chrome API
    global.chrome = {
      tabs: {
        create: vi.fn(),
        reload: vi.fn(),
      },
    } as unknown as typeof chrome;
  });

  it("should render all elements correctly", () => {
    render(<Popup />);

    const scToolsText = screen.getByText("ScTools");

    expect(scToolsText).toBeInTheDocument();
    expect(screen.getByText("Enable Extension")).toBeInTheDocument();
    expect(screen.getByText("Buy me a coffee ☕")).toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("switch starts deactivated and changes state when clicked", () => {
    render(<Popup />);
    const switchElement = screen.getByRole("switch");

    expect(switchElement).not.toBeChecked();

    fireEvent.click(switchElement);
    setTimeout(() => {
      expect(switchElement).toBeChecked();
    }, 200);

    fireEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  });

  it("should handle donation button click", () => {
    render(<Popup />);
    const donationButton = screen.getByText("Buy me a coffee ☕");
    fireEvent.click(donationButton);

    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: "https://buymeacoffee.com/juanleon",
    });
  });
});
