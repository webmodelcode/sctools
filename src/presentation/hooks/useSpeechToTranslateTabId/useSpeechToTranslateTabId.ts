import { storage } from "#imports";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

type SetValue = (value: number | null) => Promise<void>;
type GetValue = () => Promise<number | null>;
type WatchItem = (callback: (value: number | null) => void) => void;

interface IUseSpeechToTranslateTabId {
  setItem: SetValue;
  getItem: GetValue;
  watchItem: WatchItem;
}

const speechToTranslateTabId = storage.defineItem<number | null>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.SPEECH_TO_TRANSLATE_TAB_ID}`,
  {
    fallback: null,
  },
);

/**
 * Hook to manage the tab ID of the subtitle display page.
 * Provides methods to set, get, and watch the tab ID value in local storage.
 *
 * @returns {IUseSpeechToTranslateTabId} Methods to interact with the subtitle tab ID.
 */
export const useSpeechToTranslateTabId = (): IUseSpeechToTranslateTabId => {
  return {
    setItem: async (value: number | null): Promise<void> => {
      await speechToTranslateTabId.setValue(value);
    },
    getItem: async (): Promise<number | null> => {
      return await speechToTranslateTabId.getValue();
    },
    watchItem: (callback: (value: number | null) => void) => {
      speechToTranslateTabId.watch((newValue) => {
        callback(newValue);
      });
    },
  };
};
