import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useSubtitleBgColor = createStorageHook<string>(
  GLOBAL_STRINGS.STORAGE_KEYS.SUBTITLE_BG_COLOR,
  "#000000",
);
