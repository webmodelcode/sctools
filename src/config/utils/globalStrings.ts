/**
 * Global strings and constants used throughout the application.
 * This module defines configuration values such as URLs and error messages.
 *
 * @module Config/utils/GlobalStrings
 */

interface IStorageKeys {
  QUICK_MENU_IS_ACTIVE: string;
  QUICK_MESSAGES_IS_ACTIVE: string;
  QUICK_MESSAGES: string;
}

interface IErrorMessages {
  SC_ELEMENTS_NOT_READY: string;
  QM_NOT_MESSAGES: string;
}

interface IAppInformation {
  APP_NAME: string;
  APP_PROVIDER: string;
}

type IBgMessageType = "CHAT_MESSAGE" | "INPUT_MESSAGE";

interface IGlobalStrings {
  STORAGE_KEYS: IStorageKeys;
  ERROR_MESSAGES: IErrorMessages;
  BG_MESSAGE_TYPE: { [key in IBgMessageType]: IBgMessageType };
  APP_INFORMATION: IAppInformation;
}

/**
 * Global configuration constants.
 */
export const GLOBAL_STRINGS: IGlobalStrings = {
  STORAGE_KEYS: {
    /** Key for storing quick menu active state in local storage */
    QUICK_MENU_IS_ACTIVE: "quickMenuIsActive",
    /** Key for storing quick messages active state in local storage */
    QUICK_MESSAGES_IS_ACTIVE: "quickMessagesIsActive",
    /** Key for storing quick messages in local storage */
    QUICK_MESSAGES: "quickMessages",
  },
  ERROR_MESSAGES: {
    /** Error message for when StripChat elements are not ready */
    SC_ELEMENTS_NOT_READY: "Some elements are not available yet.",
    /** Error message for when quick messages are not found */
    QM_NOT_MESSAGES: "No messages found.",
  },
  BG_MESSAGE_TYPE: {
    CHAT_MESSAGE: "CHAT_MESSAGE",
    INPUT_MESSAGE: "INPUT_MESSAGE",
  },
  APP_INFORMATION: {
    APP_NAME: "ScTools",
    APP_PROVIDER: "Estrellas Webcam",
  },
};

Object.freeze(GLOBAL_STRINGS);
