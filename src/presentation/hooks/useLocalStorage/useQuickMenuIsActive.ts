/**
 * Custom hook for interacting with `localStorage`.
 * This hook provides a interface to manage the quick menu active state.
 * in the browser's local storage, with fallback support for Chrome extension storage.
 *
 * @module hooks/useQuickMenuIsActive
 */

import { storage } from "#imports";

import { GLOBAL_STINGS } from "~@/config/utils/globalStrings";

type SetValue = (value: boolean) => Promise<void>;
type GetValue = () => Promise<boolean>;

interface IUseQuickMenuIsActive {
  setItem: SetValue;
  getItem: GetValue;
}

const quickMenuIsActive = storage.defineItem<boolean>(
  `local:${GLOBAL_STINGS.EXT_QUICKMENU_ISACTIVE_LOCAL_STORAGE_KEY}`,
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
  };
};
