import { storage } from "#imports";

export interface StorageHook<T> {
  setItem: (value: T) => Promise<void>;
  getItem: () => Promise<T>;
  watchItem: (callback: (value: T) => void) => void;
}

/**
 * Factory that creates a typed localStorage hook backed by WXT storage.
 * Returns a hook function with `setItem`, `getItem`, and `watchItem` methods.
 *
 * @param key - The storage key (without the `local:` prefix)
 * @param fallback - The default value when no stored value exists
 */
export const createStorageHook = <T>(
  key: string,
  fallback: T,
): (() => StorageHook<T>) => {
  const storageItem = storage.defineItem<T>(`local:${key}`, { fallback });

  return (): StorageHook<T> => ({
    setItem: async (value: T): Promise<void> => {
      await storageItem.setValue(value);
    },
    getItem: async (): Promise<T> => {
      return await storageItem.getValue();
    },
    watchItem: (callback: (value: T) => void): void => {
      storageItem.watch((newValue) => {
        callback(newValue);
      });
    },
  });
};
