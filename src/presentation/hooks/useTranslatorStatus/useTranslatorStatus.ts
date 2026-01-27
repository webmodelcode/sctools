import { storage } from "#imports";

import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

/**
 * Type alias for setting the translator status value.
 */
type SetValue = (value: boolean) => Promise<void>;

/**
 * Type alias for getting the translator status value.
 */
type GetValue = () => Promise<boolean>;

/**
 * Type alias for watching changes in the translator status value.
 */
type WatchItem = (callback: (value: boolean) => void) => void;

/**
 * Interface for the useTranslatorStatus hook.
 */
interface IUseTranslatorStatus {
  /**
   * Sets the translator status.
   * @param value - The boolean value to set.
   * @returns A promise that resolves when the value is set.
   */
  setItem: SetValue;
  /**
   * Gets the current translator status.
   * @returns A promise that resolves to the current boolean value.
   */
  getItem: GetValue;
  /**
   * Watches for changes in the translator status.
   * @param callback - The function to call when the value changes.
   */
  watchItem: WatchItem;
}

const translatorStatus = storage.defineItem<boolean>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.TRANSLATOR_IS_ACTIVE}`,
  {
    fallback: false,
  },
);

/**
 * Hook to manage the translator active status.
 * Provides methods to set, get, and watch the status value in local storage.
 *
 * @returns {IUseTranslatorStatus} An object containing methods to interact with the translator status.
 */
export const useTranslatorStatus = (): IUseTranslatorStatus => {
  return {
    setItem: async (value: boolean): Promise<void> => {
      await translatorStatus.setValue(value);
    },
    getItem: async (): Promise<boolean> => {
      return await translatorStatus.getValue();
    },
    watchItem: async (callback: (value: boolean) => void) => {
      await translatorStatus.watch((newValue) => {
        callback(newValue);
      });
    },
  };
};
