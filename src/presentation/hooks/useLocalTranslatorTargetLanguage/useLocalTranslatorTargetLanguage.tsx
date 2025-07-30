/**
 * Custom hook for interacting with `localStorage`.
 * This hook provides a interface to manage the local translator target language state.
 * in the browser's local storage, with fallback support for Chrome extension storage.
 *
 * @module hooks/useLocalTranslatorTargetLanguage
 */

import { storage } from "#imports";

import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

type SetValue = (value: string) => Promise<void>;
type GetValue = () => Promise<string>;
type WatchItem = (callback: (value: string) => void) => void;

interface IUseLocalTranslatorTargetLanguage {
  setItem: SetValue;
  getItem: GetValue;
  watchItem: WatchItem;
}

const localTranslatorTargetLanguage = storage.defineItem<string>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.LOCAL_TRANSLATOR_TARGET_LANGUAGE}`,
  {
    fallback: "en",
  },
);

export const useLocalTranslatorTargetLanguage =
  (): IUseLocalTranslatorTargetLanguage => {
    return {
      /**
       * Sets the target language.
       * @param {string} value - The target language to set.
       * @returns {Promise<void>}
       */
      setItem: async (value: string): Promise<void> => {
        await localTranslatorTargetLanguage.setValue(value);
      },
      /**
       * Gets the current target language.
       * @returns {Promise<string>} - The stored target language.
       */
      getItem: async (): Promise<string> => {
        return await localTranslatorTargetLanguage.getValue();
      },
      /**
       * Watches for changes to the target language.
       * @param {function} callback - The callback function to be invoked when the target language changes.
       */
      watchItem: async (callback: (value: string) => void) => {
        await localTranslatorTargetLanguage.watch((newValue) => {
          callback(newValue);
        });
      },
    };
  };
