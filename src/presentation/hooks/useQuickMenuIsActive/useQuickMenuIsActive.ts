import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useQuickMenuIsActive = createStorageHook<boolean>(
  GLOBAL_STRINGS.STORAGE_KEYS.QUICK_MENU_IS_ACTIVE,
  true,
);
