/**
 * Tests for ExportForm component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ExportForm } from "../ExportForm";

// Mock the handlers
vi.mock("../handlers", () => ({
  handleExportQuickMessages: vi.fn(),
}));

// Mock clipboard API
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn(),
  },
  writable: true,
});

// Import mocked functions
import { handleExportQuickMessages } from "../handlers";

const mockHandleExportQuickMessages = vi.mocked(handleExportQuickMessages);
const mockWriteText = vi.mocked(navigator.clipboard.writeText);

describe("ExportForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  const mockMessages = [
    { label: "test1", text: "message1" },
    { label: "test2", text: "message2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockHandleExportQuickMessages.mockResolvedValue(mockMessages);
    mockWriteText.mockResolvedValue();
  });

  describe("rendering", () => {
    it("should render the form with textarea and copy button", () => {
      render(<ExportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      expect(screen.getByLabelText("Mensajes exportados")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Copiar al portapapeles" }),
      ).toBeInTheDocument();
    });

    it("should show description text", () => {
      render(<ExportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      expect(
        screen.getByText(
          "Copia y pega el contenido de los mensajes para crear un respaldo.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("data loading", () => {
    it("should load and display messages on mount", async () => {
      render(<ExportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      await waitFor(() => {
        expect(mockHandleExportQuickMessages).toHaveBeenCalled();
      });
    });
  });

  describe("copy to clipboard functionality", () => {
    it("should copy content to clipboard when button is clicked", async () => {
      render(<ExportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      await waitFor(() => {
        expect(mockHandleExportQuickMessages).toHaveBeenCalled();
      });

      const copyButton = screen.getByRole("button", {
        name: "Copiar al portapapeles",
      });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled();
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper labels and form structure", () => {
      render(<ExportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const textarea = screen.getByLabelText("Mensajes exportados");
      expect(textarea).toHaveAttribute("id", "exportData");

      const label = screen.getByText("Mensajes exportados");
      expect(label).toHaveAttribute("for", "exportData");
    });
  });
});
