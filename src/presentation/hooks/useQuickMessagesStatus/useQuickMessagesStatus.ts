import { storage } from "#imports";

import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

/**
 * Type alias for setting the quick messages status value.
 */
type SetValue = (value: boolean) => Promise<void>;

/**
 * Type alias for getting the quick messages status value.
 */
type GetValue = () => Promise<boolean>;

/**
 * Type alias for watching changes in the quick messages status value.
 */
type WatchItem = (callback: (value: boolean) => void) => void;

/**
 * Interface for the useQuickMessagesStatus hook.
 */
interface IUseQuickMessagesStatus {
  /**
   * Sets the quick messages status.
   * @param value - The boolean value to set.
   * @returns A promise that resolves when the value is set.
   */
  setItem: SetValue;
  /**
   * Gets the current quick messages status.
   * @returns A promise that resolves to the current boolean value.
   */
  getItem: GetValue;
  /**
   * Watches for changes in the quick messages status.
   * @param callback - The function to call when the value changes.
   */
  watchItem: WatchItem;
}

const quickMessagesStatus = storage.defineItem<boolean>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.QUICK_MESSAGES_IS_ACTIVE}`,
  {
    fallback: false,
  },
);

/**
 * Hook to manage the quick messages active status.
 * Provides methods to set, get, and watch the status value in local storage.
 *
 * @returns {IUseQuickMessagesStatus} An object containing methods to interact with the quick messages status.
 */
export const useQuickMessagesStatus = (): IUseQuickMessagesStatus => {
  return {
    setItem: async (value: boolean): Promise<void> => {
      await quickMessagesStatus.setValue(value);
    },
    getItem: async (): Promise<boolean> => {
      return await quickMessagesStatus.getValue();
    },
    watchItem: (callback: (value: boolean) => void) => {
      quickMessagesStatus.watch((newValue) => {
        callback(newValue);
      });
    },
  };
};
