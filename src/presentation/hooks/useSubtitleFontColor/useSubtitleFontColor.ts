import { storage } from "#imports";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

type SetValue = (value: string) => Promise<void>;
type GetValue = () => Promise<string>;
type WatchItem = (callback: (value: string) => void) => void;

interface IUseSubtitleFontColor {
  setItem: SetValue;
  getItem: GetValue;
  watchItem: WatchItem;
}

const subtitleFontColor = storage.defineItem<string>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.SUBTITLE_FONT_COLOR}`,
  {
    fallback: "#ffffff",
  },
);

/**
 * Hook to manage the subtitle display font color.
 * Provides methods to set, get, and watch the font color value in local storage.
 *
 * @returns {IUseSubtitleFontColor} Methods to interact with the subtitle font color.
 */
export const useSubtitleFontColor = (): IUseSubtitleFontColor => {
  return {
    setItem: async (value: string): Promise<void> => {
      await subtitleFontColor.setValue(value);
    },
    getItem: async (): Promise<string> => {
      return await subtitleFontColor.getValue();
    },
    watchItem: (callback: (value: string) => void) => {
      subtitleFontColor.watch((newValue) => {
        callback(newValue);
      });
    },
  };
};
