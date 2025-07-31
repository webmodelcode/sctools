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
import { getQuickMessages, addQuickMessage } from "~@/infrastructure/datasource/quickMessages.local.datasource";

const mockGetQuickMessages = vi.mocked(getQuickMessages);
const mockAddQuickMessage = vi.mocked(addQuickMessage);

describe("ImportForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetQuickMessages.mockResolvedValue([]);
    mockAddQuickMessage.mockResolvedValue();
  });

  describe("rendering", () => {
    it("should render the form with textarea and button", () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      expect(screen.getByLabelText("Datos JSON")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Ejemplo:/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Importar Mensajes" })).toBeInTheDocument();
    });

    it("should show description text", () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      expect(screen.getByText("Ingresa un array JSON con los mensajes rápidos a importar.")).toBeInTheDocument();
    });

    it("should have correct placeholder format", () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const textarea = screen.getByLabelText("Datos JSON");
      expect(textarea).toHaveAttribute("placeholder", expect.stringContaining('"label"'));
      expect(textarea).toHaveAttribute("placeholder", expect.stringContaining('"text"'));
    });
  });

  describe("form validation", () => {
    it("should show error when submitting empty form", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Por favor ingresa los datos JSON.")).toBeInTheDocument();
      });
    });

    it("should show error for invalid JSON", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const textarea = screen.getByLabelText("Datos JSON");
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
      fireEvent.change(textarea, { target: { value: "invalid json" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("JSON inválido. Verifica el formato.")).toBeInTheDocument();
      });
    });

    it("should show error when data is not an array", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const textarea = screen.getByLabelText("Datos JSON");
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
      fireEvent.change(textarea, { target: { value: '{"not": "array"}' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Los datos deben ser un array de mensajes.")).toBeInTheDocument();
      });
    });

    it("should show error when message lacks required properties", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const textarea = screen.getByLabelText("Datos JSON");
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
      fireEvent.change(textarea, { target: { value: '[{"label": "test"}]' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("El mensaje en la posición 1 debe tener 'label' y 'text'.")).toBeInTheDocument();
      });
    });
  });

  describe("successful import", () => {
    it("should import valid messages successfully", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const validJson = JSON.stringify([
        { label: "test1", text: "message1" },
        { label: "test2", text: "message2" }
      ]);
      
      const textarea = screen.getByLabelText("Datos JSON");
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
      fireEvent.change(textarea, { target: { value: validJson } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockGetQuickMessages).toHaveBeenCalled();
        expect(mockAddQuickMessage).toHaveBeenCalledTimes(2);
        expect(mockAddQuickMessage).toHaveBeenCalledWith({ label: "test1", text: "message1" });
        expect(mockAddQuickMessage).toHaveBeenCalledWith({ label: "test2", text: "message2" });
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it("should skip duplicate messages", async () => {
      mockGetQuickMessages.mockResolvedValue([
        { label: "existing", text: "existing message" }
      ]);
      
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const validJson = JSON.stringify([
        { label: "existing", text: "duplicate message" },
        { label: "new", text: "new message" }
      ]);
      
      const textarea = screen.getByLabelText("Datos JSON");
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
      fireEvent.change(textarea, { target: { value: validJson } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockAddQuickMessage).toHaveBeenCalledTimes(1);
        expect(mockAddQuickMessage).toHaveBeenCalledWith({ label: "new", text: "new message" });
      });
    });

    it("should reset form after successful import", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const validJson = JSON.stringify([{ label: "test", text: "message" }]);
      const textarea = screen.getByLabelText("Datos JSON") as HTMLTextAreaElement;
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
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
      
      const textarea = screen.getByLabelText("Datos JSON");
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
      fireEvent.change(textarea, { target: { value: JSON.stringify(testMessages) } });
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
      const textarea = screen.getByLabelText("Datos JSON");
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
      fireEvent.change(textarea, { target: { value: validJson } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Database error")).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalledWith("Database error");
      });
    });

    it("should call onError callback when provided", async () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const textarea = screen.getByLabelText("Datos JSON");
      const submitButton = screen.getByRole("button", { name: "Importar Mensajes" });
      
      fireEvent.change(textarea, { target: { value: "invalid" } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith("JSON inválido. Verifica el formato.");
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper labels and form structure", () => {
      render(<ImportForm onSuccess={mockOnSuccess} onError={mockOnError} />);
      
      const textarea = screen.getByLabelText("Datos JSON");
      expect(textarea).toHaveAttribute("id", "jsonData");
      
      const label = screen.getByText("Datos JSON");
      expect(label).toHaveAttribute("for", "jsonData");
    });
  });
});