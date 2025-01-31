import { GLOBAL_STINGS } from "@/config";

export interface QuickMessage {
  label: string;
  text: string;
}

const STORAGE_KEY = GLOBAL_STINGS.QUICK_MESSAGES_KEY;

/**
 * Save quick messages to storage.
 * @param messages Array of quick messages to save.
 */
export const saveQuickMessages = async (
  messages: QuickMessage[]
): Promise<void> => {
  try {
    if (chrome.storage) {
      await chrome.storage.local.set({ [STORAGE_KEY]: messages });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  } catch (error) {
    console.error("Failed to save quick messages:", error);
  }
};

/**
 * Retrieve quick messages from storage.
 * @returns Array of quick messages.
 */
export const getQuickMessages = async (): Promise<QuickMessage[]> => {
  try {
    if (chrome.storage) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return result[STORAGE_KEY] || [];
    } else {
      const messages = localStorage.getItem(STORAGE_KEY);
      return messages ? JSON.parse(messages) : [];
    }
  } catch (error) {
    console.error("Failed to retrieve quick messages:", error);
    return [];
  }
};

/**
 * Add a new quick message to storage.
 * @param message The quick message to add.
 */
export const addQuickMessage = async (message: QuickMessage): Promise<void> => {
  const messages = await getQuickMessages();
  messages.push(message);
  await saveQuickMessages(messages);
};

/**
 * Update an existing quick message in storage.
 * @param index The index of the message to update.
 * @param message The updated quick message.
 */
export const updateQuickMessage = async (
  index: number,
  message: QuickMessage
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
    if (chrome.storage) {
      await chrome.storage.local.remove(STORAGE_KEY);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to clear quick messages:", error);
  }
};
