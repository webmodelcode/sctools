import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useLocalTranslatorTargetLanguage = createStorageHook<string>(
  GLOBAL_STRINGS.STORAGE_KEYS.LOCAL_TRANSLATOR_TARGET_LANGUAGE,
  "en",
);
