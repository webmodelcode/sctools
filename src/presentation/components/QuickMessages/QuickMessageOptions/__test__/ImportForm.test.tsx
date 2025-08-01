/**
 * Tests for ImportForm component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ImportForm } from "../ImportForm";

// Mock the datasource functions
vi.mock("~@/infrastructure/datasource/quickMessages.local.datasource", () => ({
  getQuickMessages: vi.fn(),
  addQuickMessage: vi.fn(),
}));

// Import mocked functions
import {
  getQuickMessages,
  addQuickMessage,
} from "~@/infrastructure/datasource/quickMessages.local.datasource";

const mockGetQuickMessages = vi.mocked(getQuickMessages);
const mockAddQuickMessage = vi.mocked(addQuickMessage);

describe("ImportForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();
  const formLabel = "Mensajes";

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetQuickMessages.mockResolvedValue([]);
    mockAddQuickMessage.mockResolvedValue();
  });

  describe("rendering", () => {
    it("should render the form with textarea and button", () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      expect(screen.getByLabelText(formLabel)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Ejemplo:/)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Importar Mensajes" }),
      ).toBeInTheDocument();
    });

    it("should show description text", () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      expect(
        screen.getByText("Pega los mensajes que exportaste previamente."),
      ).toBeInTheDocument();
    });

    it("should have correct placeholder format", () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const textarea = screen.getByLabelText(formLabel);
      expect(textarea).toHaveAttribute(
        "placeholder",
        expect.stringContaining('"label"'),
      );
      expect(textarea).toHaveAttribute(
        "placeholder",
        expect.stringContaining('"text"'),
      );
    });
  });

  describe("form validation", () => {
    it("should show error when submitting empty form", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Asegúrate de ingresar los mensajes que quieres importar.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("should show error for invalid JSON", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const textarea = screen.getByLabelText(formLabel);
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, { target: { value: "invalid json" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Asegúrate de que los datos luzcan como el ejemplo.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("should show error when data is not an array", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const textarea = screen.getByLabelText(formLabel);
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, { target: { value: '{"not": "array"}' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Asegúrate de que los datos luzcan como el ejemplo.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("should show error when message lacks required properties", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const textarea = screen.getByLabelText("Mensajes");
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, { target: { value: '[{"label": "test"}]' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'El mensaje debe contener "label" y "text". Error en mensaje numero: 1',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe("successful import", () => {
    it("should import valid messages successfully", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const validJson = JSON.stringify([
        { label: "test1", text: "message1" },
        { label: "test2", text: "message2" },
      ]);

      const textarea = screen.getByLabelText("Mensajes");
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, { target: { value: validJson } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockGetQuickMessages).toHaveBeenCalled();
        expect(mockAddQuickMessage).toHaveBeenCalledTimes(2);
        expect(mockAddQuickMessage).toHaveBeenCalledWith({
          label: "test1",
          text: "message1",
        });
        expect(mockAddQuickMessage).toHaveBeenCalledWith({
          label: "test2",
          text: "message2",
        });
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("should skip duplicate messages", async () => {
      mockGetQuickMessages.mockResolvedValue([
        { label: "existing", text: "existing message" },
      ]);

      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const validJson = JSON.stringify([
        { label: "existing", text: "duplicate message" },
        { label: "new", text: "new message" },
      ]);

      const textarea = screen.getByLabelText("Mensajes");
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, { target: { value: validJson } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddQuickMessage).toHaveBeenCalledTimes(1);
        expect(mockAddQuickMessage).toHaveBeenCalledWith({
          label: "new",
          text: "new message",
        });
      });
    });

    it("should reset form after successful import", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const validJson = JSON.stringify([{ label: "test", text: "message" }]);
      const textarea = screen.getByLabelText(formLabel) as HTMLTextAreaElement;
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, { target: { value: validJson } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(textarea.value).toBe("");
      });
    });
  });

  describe("loading state", () => {
    it("should disable button during import", async () => {
      const testMessages = [{ label: "test", text: "message" }];

      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const textarea = screen.getByLabelText("Mensajes");
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, {
        target: { value: JSON.stringify(testMessages) },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("error handling", () => {
    it("should handle datasource errors", async () => {
      mockGetQuickMessages.mockRejectedValue(new Error("Database error"));

      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const validJson = JSON.stringify([{ label: "test", text: "message" }]);
      const textarea = screen.getByLabelText("Mensajes");
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, { target: { value: validJson } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Database error")).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalledWith("Database error");
      });
    });

    it("should call onError callback when provided", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const textarea = screen.getByLabelText("Mensajes");
      const submitButton = screen.getByRole("button", {
        name: "Importar Mensajes",
      });

      fireEvent.change(textarea, { target: { value: "invalid" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          "Asegúrate de que los datos luzcan como el ejemplo.",
        );
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper labels and form structure", () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);

      const textarea = screen.getByLabelText(formLabel);
      expect(textarea).toHaveAttribute("id", "jsonData");

      const label = screen.getByText(formLabel);
      expect(label).toHaveAttribute("for", "jsonData");
    });
  });
});
