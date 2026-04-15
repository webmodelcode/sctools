import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

import { createStorageHook } from "../useStorageItem/useStorageItem";

export const useUpdateNotificationStatus = createStorageHook<number>(
  GLOBAL_STRINGS.STORAGE_KEYS.UPDATE_NOTIFICATION_LAST_SHOWN,
  0,
);
