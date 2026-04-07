import { storage } from "#imports";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

type SetValue = (value: boolean) => Promise<void>;
type GetValue = () => Promise<boolean>;
type WatchItem = (callback: (value: boolean) => void) => void;

interface IUseSpeechToTranslateStatus {
  setItem: SetValue;
  getItem: GetValue;
  watchItem: WatchItem;
}

const speechToTranslateStatus = storage.defineItem<boolean>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.SPEECH_TO_TRANSLATE_IS_ACTIVE}`,
  {
    fallback: false,
  },
);

/**
 * Hook to manage the speech-to-translate active status.
 * Provides methods to set, get, and watch the status value in local storage.
 *
 * @returns {IUseSpeechToTranslateStatus} Methods to interact with the speech-to-translate status.
 */
export const useSpeechToTranslateStatus = (): IUseSpeechToTranslateStatus => {
  return {
    setItem: async (value: boolean): Promise<void> => {
      await speechToTranslateStatus.setValue(value);
    },
    getItem: async (): Promise<boolean> => {
      return await speechToTranslateStatus.getValue();
    },
    watchItem: (callback: (value: boolean) => void) => {
      speechToTranslateStatus.watch((newValue) => {
        callback(newValue);
      });
    },
  };
};
