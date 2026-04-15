import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useTranslatorStatus = createStorageHook<boolean>(
  GLOBAL_STRINGS.STORAGE_KEYS.TRANSLATOR_IS_ACTIVE,
  true,
);
