import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useSubtitleFontSize = createStorageHook<number>(
  GLOBAL_STRINGS.STORAGE_KEYS.SUBTITLE_FONT_SIZE,
  24,
);
