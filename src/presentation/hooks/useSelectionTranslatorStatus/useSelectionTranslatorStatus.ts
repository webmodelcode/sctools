import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useSelectionTranslatorStatus = createStorageHook<boolean>(
  GLOBAL_STRINGS.STORAGE_KEYS.SELECTION_TRANSLATOR_IS_ACTIVE,
  true,
);
