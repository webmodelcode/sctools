import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useSelectionTranslatorTargetLanguage = createStorageHook<string>(
  GLOBAL_STRINGS.STORAGE_KEYS.SELECTION_TRANSLATOR_TARGET_LANGUAGE,
  "en",
);
