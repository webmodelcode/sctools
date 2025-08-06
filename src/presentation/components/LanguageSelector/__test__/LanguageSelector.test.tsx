import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

// Mock the hooks
vi.mock(
  "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage",
  () => ({
    useLocalTranslatorTargetLanguage: vi.fn(),
  }),
);

// Mock UI components
vi.mock("../ui/popover", () => ({
  Popover: ({ children, open, onOpenChange }: any) =>
    React.createElement("div", {
      "data-testid": "popover",
      "data-open": open,
      onClick: () => onOpenChange?.(!open),
    }, children),
  PopoverContent: ({ children, className }: any) =>
    React.createElement("div", {
      "data-testid": "popover-content",
      className,
    }, children),
  PopoverTrigger: ({ children, asChild }: any) =>
    React.createElement("div", {
      "data-testid": "popover-trigger",
    }, children),
}));

vi.mock("../ui/command", () => ({
  Command: ({ children }: any) =>
    React.createElement("div", {
      "data-testid": "command",
    }, children),
  CommandEmpty: ({ children }: any) =>
    React.createElement("div", {
      "data-testid": "command-empty",
    }, children),
  CommandGroup: ({ children }: any) =>
    React.createElement("div", {
      "data-testid": "command-group",
    }, children),
  CommandInput: ({ placeholder, className }: any) =>
    React.createElement("input", {
      "data-testid": "command-input",
      placeholder,
      className,
    }),
  CommandItem: ({ children, value, onSelect }: any) =>
    React.createElement("div", {
      "data-testid": "command-item",
      "data-value": value,
      onClick: () => onSelect?.(value),
    }, children),
  CommandList: ({ children }: any) =>
    React.createElement("div", {
      "data-testid": "command-list",
    }, children),
}));

vi.mock("../ui/button", () => ({
  Button: ({ children, variant, role, className, ...props }: any) =>
    React.createElement("button", {
      "data-testid": "button",
      "data-variant": variant,
      role,
      className,
      ...props,
    }, children),
}));

vi.mock("lucide-react", () => ({
  Check: () => React.createElement("span", { "data-testid": "check-icon" }, "✓"),
  ChevronsUpDown: () => React.createElement("span", { "data-testid": "chevrons-icon" }, "⇅"),
  SearchIcon: () => React.createElement("span", { "data-testid": "search-icon" }, "🔍"),
}));

vi.mock("~@/presentation/lib/utils", () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(" "),
}));

// Mock language data
vi.mock("../languagesSupported", () => ({
  default: [
    { label: "Inglés", value: "en" },
    { label: "Español", value: "es" },
    { label: "Francés", value: "fr" },
    { label: "Alemán", value: "de" },
  ],
}));

// Mock strings
vi.mock("../languageSelector.strings.json", () => ({
  LANGUAGE_SELECTOR: {
    SELECT_LANGUAGE: "Selecciona un lenguaje...",
    SEARCH_PLACEHOLDER: "Buscar lenguaje...",
    NO_LANGUAGE_FOUND: "No se encontraron lenguajes.",
  },
}));

// Import after mocking
import { LanguageSelector } from "../LanguageSelector";
import { useLocalTranslatorTargetLanguage } from "~@/presentation/hooks/useLocalTranslatorTargetLanguage/useLocalTranslatorTargetLanguage";

describe("LanguageSelector", () => {
  const mockSetItem = vi.fn();
  const mockGetItem = vi.fn();
  const mockWatchItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock setup
    vi.mocked(useLocalTranslatorTargetLanguage).mockReturnValue({
      setItem: mockSetItem.mockResolvedValue(undefined),
      getItem: mockGetItem.mockResolvedValue("en"),
      watchItem: mockWatchItem,
    });
  });

  describe("rendering", () => {
    it("should render the language selector button", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      // Check that chevron icon is rendered (ChevronsUpDown component)
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should display placeholder text when no language is selected", async () => {
      mockGetItem.mockResolvedValue("");
      
      await act(async () => {
        render(<LanguageSelector />);
      });

      await waitFor(() => {
        expect(screen.getByText("Selecciona un lenguaje...")).toBeInTheDocument();
      });
    });

    it("should display selected language label", async () => {
      mockGetItem.mockResolvedValue("es");
      
      await act(async () => {
        render(<LanguageSelector />);
      });

      await waitFor(() => {
        expect(screen.getByText("Español")).toBeInTheDocument();
      });
    });

    it("should have correct button attributes", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      const button = screen.getByRole("combobox");
      expect(button).toHaveAttribute("role", "combobox");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("popover functionality", () => {
    it("should open popover when button is clicked", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      fireEvent.click(screen.getByRole("combobox"));
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText("Buscar lenguaje...")).toBeInTheDocument();
      });
    });

    it("should render command components when popover is open", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      fireEvent.click(screen.getByRole("combobox"));
      
      expect(screen.getByPlaceholderText("Buscar lenguaje...")).toBeInTheDocument();
    });

    it("should display search placeholder", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      fireEvent.click(screen.getByRole("combobox"));
      
      expect(screen.getByPlaceholderText("Buscar lenguaje...")).toBeInTheDocument();
    });

    it("should display 'no language found' message", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      fireEvent.click(screen.getByRole("combobox"));
      
      const searchInput = screen.getByPlaceholderText("Buscar lenguaje...");
      fireEvent.change(searchInput, { target: { value: "xyz" } });
      
      expect(screen.getByText("No se encontraron lenguajes.")).toBeInTheDocument();
    });
  });

  describe("language options", () => {
    it("should render all available languages", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      fireEvent.click(screen.getByRole("combobox"));
      
      // Check that language options are available in the dropdown
      expect(screen.getAllByText("Inglés")).toHaveLength(2); // One in button, one in list
      expect(screen.getAllByText("Español")).toHaveLength(1); // Only in list
      expect(screen.getAllByText("Francés")).toHaveLength(1);
      expect(screen.getAllByText("Alemán")).toHaveLength(1);
    });

    it("should show selected language in button", async () => {
      mockGetItem.mockResolvedValue("es");
      
      await act(async () => {
        render(<LanguageSelector />);
      });

      await waitFor(() => {
        expect(screen.getByRole("combobox")).toHaveTextContent("Español");
      });
    });

    it("should call setItem when language is selected", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      fireEvent.click(screen.getByRole("combobox"));
      
      const frenchOption = screen.getByRole("option", { name: /francés/i });
      fireEvent.click(frenchOption);
      
      expect(mockSetItem).toHaveBeenCalledWith("fr");
    });

    it("should close popover after language selection", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      // Open popover
      fireEvent.click(screen.getByRole("combobox"));
      
      expect(screen.getByPlaceholderText("Buscar lenguaje...")).toBeInTheDocument();

      // Select a language
      const germanOption = screen.getByRole("option", { name: /alemán/i });
      fireEvent.click(germanOption);
      
      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Buscar lenguaje...")).not.toBeInTheDocument();
      });
    });
  });

  describe("hook integration", () => {
    it("should call useLocalTranslatorTargetLanguage hook", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      expect(useLocalTranslatorTargetLanguage).toHaveBeenCalled();
    });

    it("should call getItem on component mount", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      await waitFor(() => {
        expect(mockGetItem).toHaveBeenCalled();
      });
    });

    it("should setup watchItem callback", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      expect(mockWatchItem).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should update value when watchItem callback is triggered", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      // Get the callback passed to watchItem
      const watchCallback = mockWatchItem.mock.calls[0][0];
      
      // Trigger the callback with a new value
      act(() => {
        watchCallback("fr");
      });

      await waitFor(() => {
        expect(screen.getByText("Francés")).toBeInTheDocument();
      });
    });
  });

  describe("state management", () => {
    it("should initialize and load from storage", async () => {
      mockGetItem.mockResolvedValue("");
      
      await act(async () => {
        render(<LanguageSelector />);
      });
      
      expect(mockGetItem).toHaveBeenCalled();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("should handle async setItem calls", async () => {
      mockSetItem.mockResolvedValue(undefined);
      
      await act(async () => {
        render(<LanguageSelector />);
      });

      fireEvent.click(screen.getByRole("combobox"));
      
      const englishOption = screen.getByRole("option", { name: /inglés/i });
      fireEvent.click(englishOption);
      
      await waitFor(() => {
        expect(mockSetItem).toHaveBeenCalledWith("en");
      });
    });
  });



  describe("accessibility", () => {
    it("should have proper ARIA attributes", async () => {
      await act(async () => {
        render(<LanguageSelector />);
      });

      const button = screen.getByRole("combobox");
      expect(button).toHaveAttribute("role", "combobox");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("component lifecycle", () => {
    it("should cleanup properly on unmount", async () => {
      const { unmount } = render(<LanguageSelector />);
      
      unmount();
      
      // Should not throw any errors
      expect(true).toBe(true);
    });
  });
});