interface UseLocalStorage {
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

export const useLocalStorage = (): UseLocalStorage => {
  return {
    setItem: setLocalStorageData,
    getItem: getLocalStorageData,
    removeItem: deleteLocalStorageData,
    clean: cleanLocalStorage,
  };
};
