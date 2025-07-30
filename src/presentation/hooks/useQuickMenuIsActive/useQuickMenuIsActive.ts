/**
 * Custom hook for interacting with `localStorage`.
 * This hook provides a interface to manage the quick menu active state.
 * in the browser's local storage, with fallback support for Chrome extension storage.
 *
 * @module hooks/useQuickMenuIsActive
 */

import { storage } from "#imports";

import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

type SetValue = (value: boolean) => Promise<void>;
type GetValue = () => Promise<boolean>;
type WatchItem = (callback: (value: boolean) => void) => void;

interface IUseQuickMenuIsActive {
  setItem: SetValue;
  getItem: GetValue;
  watchItem: WatchItem;
}

const quickMenuIsActive = storage.defineItem<boolean>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.QUICK_MENU_IS_ACTIVE}`,
  {
    fallback: true,
  },
);

/**
 * Custom hook for interacting with local storage for quick menu state.
 *
 * @returns {IUseQuickMenuIsActive} - An object containing storage methods for quick menu activate state.
 */
export const useQuickMenuIsActive = (): IUseQuickMenuIsActive => {
  return {
    /**
     * Sets the active state of the quick menu.
     * @param {boolean} value - The state to set (true for active, false for inactive).
     * @returns {Promise<void>}
     */
    setItem: async (value: boolean): Promise<void> => {
      await quickMenuIsActive.setValue(value);
    },
    /**
     * Gets the current active state of the quick menu.
     * @returns {Promise<boolean>} - The stored state (true for active, false for inactive).
     */
    getItem: async (): Promise<boolean> => {
      return await quickMenuIsActive.getValue();
    },
    /**
     * Watches for changes to the quick menu active state.
     * @param {function} callback - The callback function to be invoked when the state changes.
     */
    watchItem: async (callback: (value: boolean) => void) => {
      await quickMenuIsActive.watch((newInstallDate, oldInstallDate) => {
        callback(newInstallDate ?? false);
      });
    },
  };
};
