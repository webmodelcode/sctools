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
  DONATION_URL: "https://buymeacoffee.com/juanleon",
  SC_ELEMENTS_NO_READY: "Some elements are not available yet.",
  EXT_ISACTIVE_LOCAL_STORAGE_KEY: "sctIsActive",
  QUICK_MESSAGES_KEY: "quickMessages",
};

Object.freeze(GLOBAL_STINGS);
