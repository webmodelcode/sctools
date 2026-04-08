import { storage } from "#imports";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

type SetValue = (value: number) => Promise<void>;
type GetValue = () => Promise<number>;
type WatchItem = (callback: (value: number) => void) => void;

interface IUseSubtitleFontSize {
  setItem: SetValue;
  getItem: GetValue;
  watchItem: WatchItem;
}

const subtitleFontSize = storage.defineItem<number>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.SUBTITLE_FONT_SIZE}`,
  {
    fallback: 36,
  },
);

/**
 * Hook to manage the subtitle display font size.
 * Provides methods to set, get, and watch the font size value in local storage.
 *
 * @returns {IUseSubtitleFontSize} Methods to interact with the subtitle font size.
 */
export const useSubtitleFontSize = (): IUseSubtitleFontSize => {
  return {
    setItem: async (value: number): Promise<void> => {
      await subtitleFontSize.setValue(value);
    },
    getItem: async (): Promise<number> => {
      return await subtitleFontSize.getValue();
    },
    watchItem: (callback: (value: number) => void) => {
      subtitleFontSize.watch((newValue) => {
        callback(newValue);
      });
    },
  };
};
