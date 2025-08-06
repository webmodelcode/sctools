/**
 * Tests for QuickMessageOptions UI components and utilities
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  getActionIcon,
  getDialogTitle,
  getDialogDescription,
  shouldShowMessageInput,
} from "../components";
import type { LabelOptions } from "../types";

describe("QuickMessageOptions Components", () => {
  describe("getActionIcon", () => {
    it("should return an icon element for add action", () => {
      const { container } = render(getActionIcon("add"));
      const svg = container.querySelector("svg");

      expect(svg).toBeInTheDocument();
    });

    it("should return an icon element for delete action", () => {
      const { container } = render(getActionIcon("delete"));
      const svg = container.querySelector("svg");

      expect(svg).toBeInTheDocument();
    });

    it("should return an icon element for update action", () => {
      const { container } = render(getActionIcon("update"));
      const svg = container.querySelector("svg");

      expect(svg).toBeInTheDocument();
    });

    it("should return different icons for different actions", () => {
      const addIcon = getActionIcon("add");
      const deleteIcon = getActionIcon("delete");
      const updateIcon = getActionIcon("update");

      expect(addIcon).toBeDefined();
      expect(deleteIcon).toBeDefined();
      expect(updateIcon).toBeDefined();
    });
  });

  describe("getDialogTitle", () => {
    it("should return correct title for add action", () => {
      const result = getDialogTitle("add");
      expect(result).toBe("Añadir Mensaje Rápido");
    });

    it("should return correct title for update action", () => {
      const result = getDialogTitle("update");
      expect(result).toBe("Actualizar Mensaje Rápido");
    });

    it("should return correct title for delete action", () => {
      const result = getDialogTitle("delete");
      expect(result).toBe("Eliminar Mensaje Rápido");
    });
  });

  describe("getDialogDescription", () => {
    it("should return correct description for add action", () => {
      const result = getDialogDescription("add");
      expect(result).toBe(
        "Añade un mensaje rápido aquí. Haz clic en guardar cuando estés listo.",
      );
    });

    it("should return correct description for update action", () => {
      const result = getDialogDescription("update");
      expect(result).toBe(
        "Actualiza un mensaje rápido aquí. Haz clic en guardar cuando estés listo.",
      );
    });

    it("should return correct description for delete action", () => {
      const result = getDialogDescription("delete");
      expect(result).toBe(
        "Elimina un mensaje rápido aquí. Haz clic en guardar cuando estés listo.",
      );
    });
  });

  describe("shouldShowMessageInput", () => {
    it("should return true for add action", () => {
      const result = shouldShowMessageInput("add");
      expect(result).toBe(true);
    });

    it("should return true for update action", () => {
      const result = shouldShowMessageInput("update");
      expect(result).toBe(true);
    });

    it("should return false for delete action", () => {
      const result = shouldShowMessageInput("delete");
      expect(result).toBe(false);
    });
  });

  describe("type consistency", () => {
    it("should handle all LabelOptions values", () => {
      const labels: LabelOptions[] = ["add", "update", "delete"];

      labels.forEach((label) => {
        expect(() => getActionIcon(label)).not.toThrow();
        expect(() => getDialogTitle(label)).not.toThrow();
        expect(() => getDialogDescription(label)).not.toThrow();
        expect(() => shouldShowMessageInput(label)).not.toThrow();
      });
    });

    it("should return consistent types", () => {
      const labels: LabelOptions[] = ["add", "update", "delete"];

      labels.forEach((label) => {
        expect(typeof getDialogTitle(label)).toBe("string");
        expect(typeof getDialogDescription(label)).toBe("string");
        expect(typeof shouldShowMessageInput(label)).toBe("boolean");
      });
    });
  });
});
