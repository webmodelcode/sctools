/**
 * Tests for QuickMessageOptions types and constants
 */

import { describe, it, expect } from "vitest";
import { ERROR_MESSAGES } from "../types";
import type { LabelOptions, ErrorMessage } from "../types";

describe("QuickMessageOptions Types", () => {
  describe("ERROR_MESSAGES", () => {
    it("should return correct error message for ALREADY_EXISTS", () => {
      const label = "Test Label";
      const result = ERROR_MESSAGES.ALREADY_EXISTS(label);

      expect(result).toEqual({
        title: `${label} Ya existe`,
        message: "Ingrese un nuevo etiqueta o utilice la opción de actualizar",
      });
    });

    it("should return correct error message for NOT_EXISTS", () => {
      const label = "Test Label";
      const result = ERROR_MESSAGES.NOT_EXISTS(label);

      expect(result).toEqual({
        title: `${label} No existe`,
        message: "Ingrese una etiqueta existente",
      });
    });

    it("should return correct error message for DELETE_NOT_FOUND", () => {
      const label = "Test Label";
      const result = ERROR_MESSAGES.DELETE_NOT_FOUND(label);

      expect(result).toEqual({
        title: `${label} No existe`,
        message: "Ingrese una etiqueta existente",
      });
    });

    it("should return correct error message for INVALID_INPUT", () => {
      const result = ERROR_MESSAGES.INVALID_INPUT;

      expect(result).toEqual({
        title: "Entrada inválida",
        message: "Por favor, complete todos los campos",
      });
    });
  });

  describe("Type definitions", () => {
    it("should accept valid LabelOptions values", () => {
      const validLabels: LabelOptions[] = ["add", "update", "delete"];

      validLabels.forEach((label) => {
        expect(["add", "update", "delete"]).toContain(label);
      });
    });

    it("should define ErrorMessage interface correctly", () => {
      const errorMessage: ErrorMessage = {
        title: "Test Title",
        message: "Test Message",
      };

      expect(errorMessage).toHaveProperty("title");
      expect(errorMessage).toHaveProperty("message");
      expect(typeof errorMessage.title).toBe("string");
      expect(typeof errorMessage.message).toBe("string");
    });
  });
});
