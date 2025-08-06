/**
 * Utility functions for QuickMessageOptions component
 */

import { getQuickMessages, IQuickMessage } from "~@/infrastructure/datasource/quickMessages.local.datasource";

/**
 * Checks if a quick message with the given label exists
 * @param label - The label to search for
 * @returns Promise<number> - Index of the message (-1 if not found)
 */
export const findQuickMessageIndex = async (label: string): Promise<number> => {
  const quickMessages = await getQuickMessages();
  return quickMessages.findIndex((qm) => qm.label === label);
};

/**
 * Validates and creates a quick message object from form inputs
 * @param titleRef - Reference to title input
 * @param messageRef - Reference to message input
 * @returns IQuickMessage | null - Valid message object or null if invalid
 */
export const createQuickMessageFromInputs = (
  titleRef: React.RefObject<HTMLInputElement | null>,
  messageRef: React.RefObject<HTMLInputElement | null>
): IQuickMessage | null => {
  const label = titleRef.current?.value?.trim() ?? "";
  const text = messageRef.current?.value?.trim() ?? "";
  
  if (!label || !text) {
    return null;
  }
  
  return { label, text };
};

/**
 * Gets the title value from the title input reference
 * @param titleRef - Reference to title input
 * @returns string - Trimmed title value
 */
export const getTitleFromInput = (titleRef: React.RefObject<HTMLInputElement | null>): string => {
  return titleRef.current?.value?.trim() ?? "";
};

/**
 * Validates if a string is not empty after trimming
 * @param value - String to validate
 * @returns boolean - True if valid, false otherwise
 */
export const isValidInput = (value: string): boolean => {
  return value?.trim().length > 0;
};