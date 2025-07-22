import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Popup } from "../Popup";

describe("Popup Component", () => {
  beforeEach(() => {
    // Mock chrome API
  });

  it("should render all elements correctly", () => {
    render(<Popup />);

    const scToolsText = screen.getByText("ScTools");

    expect(scToolsText).toBeInTheDocument();
    expect(screen.getByText("Enable Extension")).toBeInTheDocument();
    expect(screen.getByText("Enable Extension")).toBeInTheDocument();
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
});
