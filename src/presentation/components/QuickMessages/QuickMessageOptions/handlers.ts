/**
 * Business logic handlers for QuickMessageOptions component
 */

import {
  addQuickMessage,
  updateQuickMessage,
  deleteQuickMessage,
  getQuickMessages,
  IQuickMessage,
  importQuickMessages,
} from "~@/infrastructure/datasource/quickMessages.local.datasource";

import { ErrorMessage, ERROR_MESSAGES } from "./types";
import {
  findQuickMessageIndex,
  createQuickMessageFromInputs,
  getTitleFromInput,
} from "./utils";

/**
 * Handler for adding a new quick message
 * @param titleRef - Reference to title input
 * @param messageRef - Reference to message input
 * @param setErrorMsg - Function to set error messages
 * @param setIsOpen - Function to close the dialog
 */
export const handleAddMessage = async (
  titleRef: React.RefObject<HTMLInputElement | null>,
  messageRef: React.RefObject<HTMLInputElement | null>,
  setErrorMsg: (error: ErrorMessage) => void,
  setIsOpen: (open: boolean) => void,
): Promise<void> => {
  const quickMessage = createQuickMessageFromInputs(titleRef, messageRef);
  if (!quickMessage) {
    setErrorMsg(ERROR_MESSAGES.INVALID_INPUT);
    return;
  }

  const existingIndex = await findQuickMessageIndex(quickMessage.label);
  if (existingIndex >= 0) {
    setErrorMsg(ERROR_MESSAGES.ALREADY_EXISTS(quickMessage.label));
    return;
  }

  await addQuickMessage(quickMessage);
  setIsOpen(false);
};

/**
 * Handler for updating an existing quick message
 * @param titleRef - Reference to title input
 * @param messageRef - Reference to message input
 * @param setErrorMsg - Function to set error messages
 * @param setIsOpen - Function to close the dialog
 */
export const handleUpdateMessage = async (
  titleRef: React.RefObject<HTMLInputElement | null>,
  messageRef: React.RefObject<HTMLInputElement | null>,
  setErrorMsg: (error: ErrorMessage) => void,
  setIsOpen: (open: boolean) => void,
): Promise<void> => {
  const quickMessage = createQuickMessageFromInputs(titleRef, messageRef);
  if (!quickMessage) {
    setErrorMsg(ERROR_MESSAGES.INVALID_INPUT);
    return;
  }

  const existingIndex = await findQuickMessageIndex(quickMessage.label);
  if (existingIndex < 0) {
    setErrorMsg(ERROR_MESSAGES.NOT_EXISTS(quickMessage.label));
    return;
  }

  await updateQuickMessage(existingIndex, quickMessage);
  setIsOpen(false);
};

/**
 * Handler for deleting a quick message
 * @param titleRef - Reference to title input
 * @param setErrorMsg - Function to set error messages
 * @param setIsOpen - Function to close the dialog
 */
export const handleDeleteMessage = async (
  titleRef: React.RefObject<HTMLInputElement | null>,
  setErrorMsg: (error: ErrorMessage) => void,
  setIsOpen: (open: boolean) => void,
): Promise<void> => {
  const title = getTitleFromInput(titleRef);
  if (!title) {
    setErrorMsg(ERROR_MESSAGES.INVALID_INPUT);
    return;
  }

  const existingIndex = await findQuickMessageIndex(title);
  if (existingIndex < 0) {
    setErrorMsg(ERROR_MESSAGES.DELETE_NOT_FOUND(title));
    return;
  }

  await deleteQuickMessage(existingIndex);
  setIsOpen(false);
};

/**
 * Handler for exporting quick messages
 * @returns Promise that resolves to an array of quick messages
 */
export const handleExportQuickMessages = async () => {
  const quickMessages = await getQuickMessages();
  if (!quickMessages) return [];
  return quickMessages;
};

/**
 * Handler for importing quick messages
 * @param messages Array of quick messages to import
 */
export const handleImportQuickMessages = async (
  messages: IQuickMessage[],
): Promise<void> => {
  if (!messages) return;
  await importQuickMessages(messages);
};
