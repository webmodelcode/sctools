import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useSpeechToTranslateStatus = createStorageHook<boolean>(
  GLOBAL_STRINGS.STORAGE_KEYS.SPEECH_TO_TRANSLATE_IS_ACTIVE,
  false,
);
