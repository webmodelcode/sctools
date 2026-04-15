import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useSubtitleFontColor = createStorageHook<string>(
  GLOBAL_STRINGS.STORAGE_KEYS.SUBTITLE_FONT_COLOR,
  "#ffffff",
);
