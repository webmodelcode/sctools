import { storage } from "#imports";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

type SetValue = (value: string) => Promise<void>;
type GetValue = () => Promise<string>;
type WatchItem = (callback: (value: string) => void) => void;

interface IUseSubtitleBgColor {
  setItem: SetValue;
  getItem: GetValue;
  watchItem: WatchItem;
}

const subtitleBgColor = storage.defineItem<string>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.SUBTITLE_BG_COLOR}`,
  {
    fallback: "#000000",
  },
);

/**
 * Hook to manage the subtitle display background color.
 * Provides methods to set, get, and watch the background color value in local storage.
 *
 * @returns {IUseSubtitleBgColor} Methods to interact with the subtitle background color.
 */
export const useSubtitleBgColor = (): IUseSubtitleBgColor => {
  return {
    setItem: async (value: string): Promise<void> => {
      await subtitleBgColor.setValue(value);
    },
    getItem: async (): Promise<string> => {
      return await subtitleBgColor.getValue();
    },
    watchItem: (callback: (value: string) => void) => {
      subtitleBgColor.watch((newValue) => {
        callback(newValue);
      });
    },
  };
};
