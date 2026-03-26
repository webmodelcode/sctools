import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

vi.mock(
  "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage",
  () => ({ useLocalTranslatorTargetLanguage: vi.fn() }),
);

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

import { LanguageSelector } from "../LanguageSelector";
import { useLocalTranslatorTargetLanguage } from "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage";

describe("LanguageSelector", () => {
  const mockSetItem = vi.fn();
  const mockGetItem = vi.fn();
  const mockWatchItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLocalTranslatorTargetLanguage).mockReturnValue({
      setItem: mockSetItem.mockResolvedValue(undefined),
      getItem: mockGetItem.mockResolvedValue("en"),
      watchItem: mockWatchItem,
    });
  });

  it("shows placeholder when no language is stored", async () => {
    mockGetItem.mockResolvedValue("");
    render(<LanguageSelector />);
    await waitFor(() => {
      expect(screen.getByText("Selecciona un lenguaje...")).toBeInTheDocument();
    });
  });

  it("shows the stored language label on mount", async () => {
    mockGetItem.mockResolvedValue("es");
    render(<LanguageSelector />);
    await waitFor(() => {
      expect(screen.getByText("Español")).toBeInTheDocument();
    });
  });

  it("opens the language list when the trigger is clicked", async () => {
    render(<LanguageSelector />);
    await waitFor(() => expect(screen.getByText("Inglés")).toBeInTheDocument());

    fireEvent.click(screen.getByTestId("language-trigger"));

    expect(screen.getByPlaceholderText("Buscar lenguaje...")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Español" })).toBeInTheDocument();
  });

  it("saves the selected language and closes the list on selection", async () => {
    render(<LanguageSelector />);
    await waitFor(() => expect(screen.getByText("Inglés")).toBeInTheDocument());

    fireEvent.click(screen.getByTestId("language-trigger"));
    fireEvent.click(screen.getByRole("option", { name: "Español" }));

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith("es");
      expect(screen.queryByTestId("language-content")).not.toBeInTheDocument();
    });
  });

  it("updates the displayed language when the storage watcher fires", async () => {
    render(<LanguageSelector />);
    await waitFor(() => expect(screen.getByText("Inglés")).toBeInTheDocument());

    const [watchCallback] = mockWatchItem.mock.calls[0];
    act(() => watchCallback("fr"));

    await waitFor(() => {
      expect(screen.getByText("Francés")).toBeInTheDocument();
    });
  });
});
