import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SelectionTooltip, SelectionTooltipProps } from "../SelectionTooltip";

const defaultProps: SelectionTooltipProps = {
  status: "idle",
  translatedText: null,
  sourceLanguage: null,
  onRetry: vi.fn(),
  onLanguageChange: vi.fn(),
  targetLanguage: "en",
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
  });
});

describe("SelectionTooltip", () => {
  it("shows spinner in translating state", () => {
    render(<SelectionTooltip {...defaultProps} status="translating" />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("translated-text")).toBeNull();
    expect(screen.queryByTestId("error-message")).toBeNull();
  });

  it("shows translated text and source language in done state", () => {
    render(
      <SelectionTooltip
        {...defaultProps}
        status="done"
        translatedText="Hello world"
        sourceLanguage="es"
      />,
    );
    expect(screen.getByTestId("translated-text")).toHaveTextContent("Hello world");
    expect(screen.getByTestId("source-language")).toHaveTextContent("Desde: Español");
    expect(screen.queryByTestId("spinner")).toBeNull();
  });

  it("shows error message and retry button in error state", () => {
    const onRetry = vi.fn();
    render(
      <SelectionTooltip
        {...defaultProps}
        status="error"
        errorMessage="Translation unavailable"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByTestId("error-message")).toHaveTextContent("Translation unavailable");
    expect(screen.getByTestId("retry-button")).toBeInTheDocument();
    expect(screen.queryByTestId("spinner")).toBeNull();
  });

  it("calls onRetry when retry button clicked", () => {
    const onRetry = vi.fn();
    render(<SelectionTooltip {...defaultProps} status="error" onRetry={onRetry} />);
    fireEvent.click(screen.getByTestId("retry-button"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("copy button writes text to clipboard and shows checkmark", async () => {
    render(
      <SelectionTooltip
        {...defaultProps}
        status="done"
        translatedText="Translated!"
        sourceLanguage="es"
      />,
    );
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-button"));
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Translated!");
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("copy button reverts to copy icon after 2 seconds", async () => {
    vi.useFakeTimers();
    render(
      <SelectionTooltip
        {...defaultProps}
        status="done"
        translatedText="Hello"
        sourceLanguage="es"
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("copy-button"));
    });
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("renders language select with current targetLanguage", () => {
    render(
      <SelectionTooltip
        {...defaultProps}
        status="done"
        translatedText="Hello"
        sourceLanguage="es"
        targetLanguage="es"
      />,
    );
    expect(screen.getByRole("combobox")).toHaveValue("es");
  });

  it("calls onLanguageChange when select value changes", () => {
    const onLanguageChange = vi.fn();
    render(
      <SelectionTooltip
        {...defaultProps}
        status="done"
        translatedText="Hello"
        sourceLanguage="es"
        onLanguageChange={onLanguageChange}
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "fr" } });
    expect(onLanguageChange).toHaveBeenCalledWith("fr");
  });

  it("shows fallback error text when errorMessage is undefined", () => {
    render(<SelectionTooltip {...defaultProps} status="error" />);
    expect(screen.getByTestId("error-message")).toHaveTextContent("Error al traducir");
  });

  it("shows source language code when not in languagesSupported", () => {
    render(
      <SelectionTooltip
        {...defaultProps}
        status="done"
        translatedText="Test"
        sourceLanguage="xx"
      />,
    );
    expect(screen.getByTestId("source-language")).toHaveTextContent("Desde: xx");
  });
});
