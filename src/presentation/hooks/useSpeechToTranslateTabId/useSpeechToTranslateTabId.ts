import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useSpeechToTranslateTabId = createStorageHook<number | null>(
  GLOBAL_STRINGS.STORAGE_KEYS.SPEECH_TO_TRANSLATE_TAB_ID,
  null,
);
