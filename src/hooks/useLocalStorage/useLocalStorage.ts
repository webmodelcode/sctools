/**
 * Custom hook for interacting with `localStorage` or `chrome.storage.local`.
 * This hook provides a unified interface for storing, retrieving, and deleting data
 * in the browser's local storage, with fallback support for Chrome extension storage.
 *
 * @module hooks/useLocalStorage
 */

export interface UseLocalStorage {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<
    | string
    | {
        [key: string]: unknown;
      }
    | null
  >;
  removeItem: (key: string) => Promise<void>;
  clean: () => Promise<void>;
}

const setLocalStorageData = async (key: string, value: string) => {
  if (!chrome.storage) {
    return localStorage.setItem(key, value);
  }
  await chrome.storage.local.set({ [key]: value });
};

const getLocalStorageData = async (key: string) => {
  if (!chrome.storage) {
    return localStorage.getItem(key);
  }
  const data = await chrome.storage.local.get(key);
  return data[key] || "";
};

const deleteLocalStorageData = async (key: string) => {
  if (!chrome.storage) {
    return localStorage.removeItem(key);
  }
  await chrome.storage.local.remove(key);
};

const cleanLocalStorage = async () => {
  if (!chrome.storage) {
    return localStorage.clear();
  }
  await chrome.storage.local.clear();
};

/**
 * Custom hook for interacting with local storage.
 *
 * @returns {UseLocalStorage} - An object containing storage methods.
 */
export const useLocalStorage = (): UseLocalStorage => {
  return {
    /**
     * @param {string} key - The key under which to store the value.
     * @param {string} value - The value to store.
     * @returns {Promise<void>}
     */
    setItem: setLocalStorageData,
    /**
     * @param {string} key - The key of the value to retrieve.
     * @returns {Promise<string | { [key: string]: unknown } | null>} - The stored value or null if not found.
     */
    getItem: getLocalStorageData,
    /**
     * @param {string} key - The key of the value to remove.
     * @returns {Promise<void>}
     */
    removeItem: deleteLocalStorageData,
    /**
     * @returns {Promise<void>}
     */
    clean: cleanLocalStorage,
  };
};
