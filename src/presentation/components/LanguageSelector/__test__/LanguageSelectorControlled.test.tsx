import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

vi.mock("../../ui/own/tooltip-trigger-aschild", () => ({
  TooltipTriggerAsChild: ({ children }: any) => children,
}));

vi.mock("../../ui/popover", () => ({
  Popover: ({ children, open, onOpenChange }: any) =>
    React.createElement(
      "div",
      null,
      React.Children.map(children, (child: any) =>
        React.cloneElement(child, { open, onOpenChange }),
      ),
    ),
  PopoverTrigger: ({ children, open, onOpenChange }: any) =>
    React.createElement(
      "button",
      { "data-testid": "language-trigger", onClick: () => onOpenChange?.(!open) },
      children,
    ),
  PopoverContent: ({ children, open }: any) =>
    open
      ? React.createElement("div", { "data-testid": "language-content" }, children)
      : null,
}));

vi.mock("../../ui/command", () => ({
  Command: ({ children }: any) => React.createElement("div", null, children),
  CommandList: ({ children }: any) => React.createElement("div", null, children),
  CommandGroup: ({ children }: any) => React.createElement("div", null, children),
  CommandEmpty: ({ children }: any) =>
    React.createElement("div", { "data-testid": "cmd-empty" }, children),
  CommandInput: ({ placeholder }: any) => React.createElement("input", { placeholder }),
  CommandItem: ({ children, value, onSelect }: any) =>
    React.createElement("div", { role: "option", onClick: () => onSelect?.(value) }, children),
}));

import { LanguageSelectorControlled } from "../LanguageSelectorControlled";

describe("LanguageSelectorControlled", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows placeholder when value is empty", () => {
    render(<LanguageSelectorControlled value="" onChange={onChange} />);
    expect(screen.getByText("Selecciona un lenguaje...")).toBeInTheDocument();
  });

  it("shows language label for given value", () => {
    render(<LanguageSelectorControlled value="es" onChange={onChange} />);
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  it("opens language list on trigger click", () => {
    render(<LanguageSelectorControlled value="en" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("language-trigger"));
    expect(screen.getByTestId("language-content")).toBeInTheDocument();
  });

  it("calls onChange with selected language and closes list", async () => {
    render(<LanguageSelectorControlled value="en" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("language-trigger"));
    fireEvent.click(screen.getByRole("option", { name: "Español" }));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("es");
      expect(screen.queryByTestId("language-content")).not.toBeInTheDocument();
    });
  });

  it("accepts custom tooltipText prop", () => {
    render(
      <LanguageSelectorControlled
        value="en"
        onChange={onChange}
        tooltipText="Custom tooltip"
      />,
    );
    expect(screen.getByTestId("language-trigger")).toBeInTheDocument();
  });
});
