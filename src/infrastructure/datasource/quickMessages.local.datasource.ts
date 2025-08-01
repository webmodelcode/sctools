import { storage } from "#imports";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

const STORAGE_KEY = GLOBAL_STRINGS.STORAGE_KEYS.QUICK_MESSAGES;

export interface IQuickMessage {
  label: string;
  text: string;
}

const quickMessageStorage = storage.defineItem<IQuickMessage[]>(
  `local:${STORAGE_KEY}`,
  {
    fallback: [],
  },
);

/**
 * Save quick messages to storage.
 * @param messages Array of quick messages to save.
 */
export const saveQuickMessages = async (
  messages: IQuickMessage[],
): Promise<void> => {
  try {
    await quickMessageStorage.setValue(messages);
  } catch (error) {
    console.error("Failed to save quick messages:", error);
  }
};

/**
 * Retrieve quick messages from storage.
 * @returns Array of quick messages.
 */
export const getQuickMessages = async (): Promise<IQuickMessage[]> => {
  try {
    return await quickMessageStorage.getValue();
  } catch (error) {
    console.error("Failed to retrieve quick messages:", error);
    return [];
  }
};

export const watchQuickMessages = (
  callback: (messages: IQuickMessage[]) => void,
) => {
  quickMessageStorage.watch((newValue) => {
    callback(newValue);
  });
};

/**
 * Add a new quick message to storage.
 * @param message The quick message to add.
 */
export const addQuickMessage = async (
  message: IQuickMessage,
): Promise<void> => {
  const messages = await getQuickMessages();
  messages.push(message);
  await saveQuickMessages(messages);
};

/**
 * Import quick messages from a file.
 * @param messages Array of quick messages to import.
 */
export const importQuickMessages = async (
  messages: IQuickMessage[],
): Promise<void> => {
  await saveQuickMessages(messages);
};

/**
 * Update an existing quick message in storage.
 * @param index The index of the message to update.
 * @param message The updated quick message.
 */
export const updateQuickMessage = async (
  index: number,
  message: IQuickMessage,
): Promise<void> => {
  const messages = await getQuickMessages();
  if (index >= 0 && index < messages.length) {
    messages[index] = message;
    await saveQuickMessages(messages);
  } else {
    console.error("Invalid index for updating quick message.");
  }
};

/**
 * Delete a quick message from storage.
 * @param index The index of the message to delete.
 */
export const deleteQuickMessage = async (index: number): Promise<void> => {
  const messages = await getQuickMessages();
  if (index >= 0 && index < messages.length) {
    messages.splice(index, 1);
    await saveQuickMessages(messages);
  } else {
    console.error("Invalid index for deleting quick message.");
  }
};

/**
 * Clear all quick messages from storage.
 */
export const clearQuickMessages = async (): Promise<void> => {
  try {
    await quickMessageStorage.removeValue();
  } catch (error) {
    console.error("Failed to clear quick messages:", error);
  }
};
