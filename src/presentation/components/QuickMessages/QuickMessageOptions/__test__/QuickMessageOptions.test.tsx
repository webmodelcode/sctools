/**
 * Tests for QuickMessageOptions main component
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QuickMessageOptions } from "../QuickMessageOptions";
import type { LabelOptions } from "../types";

// Mock the handler functions
vi.mock("../handlers", () => ({
  handleAddMessage: vi.fn(),
  handleUpdateMessage: vi.fn(),
  handleDeleteMessage: vi.fn(),
}));

// Mock the component functions
vi.mock("../components", () => ({
  getActionIcon: vi.fn((label: string) => {
    const iconMap = {
      add: <div data-testid="plus-icon">Plus</div>,
      update: <div data-testid="notebook-pen-icon">NotebookPen</div>,
      delete: <div data-testid="delete-icon">Delete</div>,
    };
    return iconMap[label as keyof typeof iconMap];
  }),
  getDialogTitle: vi.fn((label: string) => {
    const titleMap = {
      add: "Add Quick Message",
      update: "Update Quick Message",
      delete: "Delete Quick Message",
    };
    return titleMap[label as keyof typeof titleMap];
  }),
  getDialogDescription: vi.fn((label: string) => {
    const descMap = {
      add: "Add a quick message here. Click save when you're done.",
      update: "Update a quick message here. Click save when you're done.",
      delete: "Delete a quick message here. Click save when you're done.",
    };
    return descMap[label as keyof typeof descMap];
  }),
  shouldShowMessageInput: vi.fn((label: string) => label !== "delete"),
}));

// Mock FloatAlert component
vi.mock("../../FloatAlert/FloatAlert", () => ({
  FloatAlert: ({ title, message, destructive }: any) => (
    <div data-testid="float-alert" data-destructive={destructive}>
      <div data-testid="alert-title">{title}</div>
      <div data-testid="alert-message">{message}</div>
    </div>
  ),
}));

const { handleAddMessage, handleUpdateMessage, handleDeleteMessage } =
  vi.mocked(await import("../handlers"));

const {
  getActionIcon,
  getDialogTitle,
  getDialogDescription,
  shouldShowMessageInput,
} = vi.mocked(await import("../components"));

describe("QuickMessageOptions Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render trigger button with correct icon for add action", () => {
      render(<QuickMessageOptions label="add" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-label", "add quick message");
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("should render trigger button with correct icon for update action", () => {
      render(<QuickMessageOptions label="update" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "update quick message");
      expect(screen.getByTestId("notebook-pen-icon")).toBeInTheDocument();
    });

    it("should render trigger button with correct icon for delete action", () => {
      render(<QuickMessageOptions label="delete" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "delete quick message");
      expect(screen.getByTestId("delete-icon")).toBeInTheDocument();
    });
  });

  describe("dialog functionality", () => {
    it("should open dialog when trigger button is clicked", async () => {
      render(<QuickMessageOptions label="add" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText("Add Quick Message")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Add a quick message here. Click save when you're done.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("should show title input field", async () => {
      render(<QuickMessageOptions label="add" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByLabelText("Titulo")).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Quick Message Title"),
        ).toBeInTheDocument();
      });
    });

    it("should show message input field for add action", async () => {
      render(<QuickMessageOptions label="add" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByLabelText("Mensaje")).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText("Write your quick message here"),
        ).toBeInTheDocument();
      });
    });

    it("should show message input field for update action", async () => {
      render(<QuickMessageOptions label="update" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByLabelText("Mensaje")).toBeInTheDocument();
      });
    });

    it("should not show message input field for delete action", async () => {
      render(<QuickMessageOptions label="delete" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.queryByLabelText("Message")).not.toBeInTheDocument();
      });
    });

    it("should show save button", async () => {
      render(<QuickMessageOptions label="add" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByText("Guardar")).toBeInTheDocument();
      });
    });
  });

  describe("handler integration", () => {
    it("should call handleAddMessage when save button is clicked for add action", async () => {
      render(<QuickMessageOptions label="add" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const saveButton = screen.getByText("Guardar");
        fireEvent.click(saveButton);
      });

      expect(handleAddMessage).toHaveBeenCalledTimes(1);
    });

    it("should call handleUpdateMessage when save button is clicked for update action", async () => {
      render(<QuickMessageOptions label="update" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const saveButton = screen.getByText("Guardar");
        fireEvent.click(saveButton);
      });

      expect(handleUpdateMessage).toHaveBeenCalledTimes(1);
    });

    it("should call handleDeleteMessage when save button is clicked for delete action", async () => {
      render(<QuickMessageOptions label="delete" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        const saveButton = screen.getByText("Guardar");
        fireEvent.click(saveButton);
      });

      expect(handleDeleteMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe("error handling", () => {
    it("should not show error alert when no error is present", async () => {
      render(<QuickMessageOptions label="add" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.queryByTestId("float-alert")).not.toBeInTheDocument();
      });
    });
  });

  describe("component functions integration", () => {
    it("should call getActionIcon with correct label", () => {
      render(<QuickMessageOptions label="add" />);
      expect(getActionIcon).toHaveBeenCalledWith("add");
    });

    it("should call getDialogTitle and getDialogDescription when dialog opens", async () => {
      render(<QuickMessageOptions label="update" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(getDialogTitle).toHaveBeenCalledWith("update");
        expect(getDialogDescription).toHaveBeenCalledWith("update");
      });
    });

    it("should call shouldShowMessageInput with correct label", async () => {
      render(<QuickMessageOptions label="delete" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(shouldShowMessageInput).toHaveBeenCalledWith("delete");
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<QuickMessageOptions label="add" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "add quick message");
    });

    it("should have proper form labels", async () => {
      render(<QuickMessageOptions label="add" />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      await waitFor(() => {
        expect(screen.getByLabelText("Titulo")).toBeInTheDocument();
        expect(screen.getByLabelText("Mensaje")).toBeInTheDocument();
      });
    });
  });

  describe("type safety", () => {
    it("should accept all valid LabelOptions", () => {
      const validLabels: LabelOptions[] = ["add", "update", "delete"];

      validLabels.forEach((label) => {
        expect(() =>
          render(<QuickMessageOptions label={label} />),
        ).not.toThrow();
      });
    });
  });
});
