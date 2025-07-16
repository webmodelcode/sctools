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

interface UseQuickMenuIsActive {
  setItem: SetValue;
  getItem: GetValue;
}

const quickMenuIsActive = storage.defineItem<boolean>(
  `local:${GLOBAL_STINGS.EXT_QUICKMENU_ISACTIVE_LOCAL_STORAGE_KEY}`,
  {
    fallback: true,
  },
);

const setQuickMenuIsActive: SetValue = async (
  value: boolean,
): Promise<void> => {
  await quickMenuIsActive.setValue(value);
};

const getQuickMenuIsActive: GetValue = async (): Promise<boolean> => {
  return await quickMenuIsActive.getValue();
};

/**
 * Custom hook for interacting with local storage.
 *
 * @returns {UseQuickMenuIsActive} - An object containing storage methods for quick menu activate state.
 */
export const useQuickMenuIsActive = (): UseQuickMenuIsActive => {
  return {
    /**
     * @param {string} key - The key under which to store the value.
     * @param {string} value - The value to store.
     * @returns {Promise<void>}
     */
    setItem: setQuickMenuIsActive,
    /**
     * @param {string} key - The key of the value to retrieve.
     * @returns {Promise<string | { [key: string]: unknown } | null>} - The stored value or null if not found.
     */
    getItem: getQuickMenuIsActive,
  };
};
