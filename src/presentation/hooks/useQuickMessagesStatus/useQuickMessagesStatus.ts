import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useQuickMessagesStatus = createStorageHook<boolean>(
  GLOBAL_STRINGS.STORAGE_KEYS.QUICK_MESSAGES_IS_ACTIVE,
  true,
);
