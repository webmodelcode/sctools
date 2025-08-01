/**
 * Type definitions and constants for QuickMessageOptions component
 */

/**
 * Available action types for quick message operations
 */
export type LabelOptions = "add" | "update" | "delete";

/**
 * Props interface for QuickMessageOptions component
 */
export interface QuickMessageOptionsProps {
  /** The type of operation to perform (add, update, or delete) */
  label: LabelOptions;
}

/**
 * Error message interface for consistent error handling
 */
export interface ErrorMessage {
  title: string;
  message: string;
}

/**
 * Constants for error messages to improve maintainability
 */
export const ERROR_MESSAGES = {
  ALREADY_EXISTS: (label: string): ErrorMessage => ({
    title: `${label} Ya existe`,
    message: "Ingrese un nuevo etiqueta o utilice la opción de actualizar",
  }),
  NOT_EXISTS: (label: string): ErrorMessage => ({
    title: `${label} No existe`,
    message: "Ingrese una etiqueta existente",
  }),
  INVALID_INPUT: {
    title: "Entrada inválida",
    message: "Por favor, complete todos los campos",
  },
  DELETE_NOT_FOUND: (label: string): ErrorMessage => ({
    title: `${label} No existe`,
    message: "Ingrese una etiqueta existente",
  }),
} as const;
