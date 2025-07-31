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
    title: `${label} Already exists`,
    message: "Set a new label or use Update option",
  }),
  NOT_EXISTS: (label: string): ErrorMessage => ({
    title: `${label} not found`,
    message: "Check the label and try again",
  }),
  INVALID_INPUT: {
    title: "Invalid input",
    message: "Please fill in all required fields",
  },
  DELETE_NOT_FOUND: (label: string): ErrorMessage => ({
    title: `${label} not found`,
    message: "Check the label and try again",
  }),
} as const;