import { storage } from "#imports";

import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";

/**
 * Type alias for setting the update notification last shown timestamp.
 */
type SetValue = (value: number) => Promise<void>;

/**
 * Type alias for getting the update notification last shown timestamp.
 */
type GetValue = () => Promise<number>;

/**
 * Type alias for watching changes in the update notification timestamp.
 */
type WatchItem = (callback: (value: number) => void) => void;

/**
 * Interface for the useUpdateNotificationStatus hook.
 */
interface IUseUpdateNotificationStatus {
  /**
   * Sets the last shown timestamp for the update notification.
   * @param value - Unix timestamp (ms) when the notification was last shown.
   */
  setItem: SetValue;
  /**
   * Gets the last shown timestamp for the update notification.
   * @returns A promise that resolves to the timestamp, or 0 if never shown.
   */
  getItem: GetValue;
  /**
   * Watches for changes in the update notification timestamp.
   * @param callback - The function to call when the value changes.
   */
  watchItem: WatchItem;
}

const updateNotificationLastShown = storage.defineItem<number>(
  `local:${GLOBAL_STRINGS.STORAGE_KEYS.UPDATE_NOTIFICATION_LAST_SHOWN}`,
  {
    fallback: 0,
  },
);

/**
 * Hook to manage the update notification throttling state.
 * Uses local storage so the timestamp persists across browser restarts.
 * Provides methods to set, get, and watch the last shown timestamp.
 *
 * @returns {IUseUpdateNotificationStatus} An object containing methods to interact with the notification status.
 */
export const useUpdateNotificationStatus = (): IUseUpdateNotificationStatus => {
  return {
    setItem: async (value: number): Promise<void> => {
      await updateNotificationLastShown.setValue(value);
    },
    getItem: async (): Promise<number> => {
      return await updateNotificationLastShown.getValue();
    },
    watchItem: (callback: (value: number) => void) => {
      updateNotificationLastShown.watch((newValue) => {
        callback(newValue);
      });
    },
  };
};
