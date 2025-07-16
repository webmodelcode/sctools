/**
 * Global strings and constants used throughout the application.
 * This module defines configuration values such as URLs and error messages.
 *
 * @module Config/utils/GlobalStrings
 */

interface GlobalStrings {
  [key: string]: string;
}

/**
 * Global configuration constants.
 */
export const GLOBAL_STINGS: GlobalStrings = {
  EXT_QUICKMENU_ISACTIVE_LOCAL_STORAGE_KEY: "quickMenuIsActive",
  EXT_ISACTIVE_LOCAL_STORAGE_KEY: "sctIsActive",
  SC_ELEMENTS_NO_READY: "Some elements are not available yet.",
  QUICK_MESSAGES_KEY: "quickMessages",
};

Object.freeze(GLOBAL_STINGS);
