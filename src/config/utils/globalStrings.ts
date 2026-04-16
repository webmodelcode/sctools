/**
 * Global strings and constants used throughout the application.
 * This module defines configuration values such as URLs and error messages.
 *
 * @module Config/utils/GlobalStrings
 */

/**
 * Global configuration constants.
 */
export const GLOBAL_STRINGS = {
  STORAGE_KEYS: {
    /** Key for storing quick menu active state in local storage */
    QUICK_MENU_IS_ACTIVE: "quickMenuIsActive",
    /** Key for storing quick messages active state in local storage */
    QUICK_MESSAGES_IS_ACTIVE: "quickMessagesIsActive",
    /** Key for storing quick messages in local storage */
    QUICK_MESSAGES: "quickMessages",
    /** Key for storing local translator target language in local storage */
    LOCAL_TRANSLATOR_TARGET_LANGUAGE: "localTranslatorTargetLanguage",
    /** Key for storing translator active state in local storage */
    TRANSLATOR_IS_ACTIVE: "translatorIsActive",
    /** Key for storing last shown timestamp of update notification in session storage */
    UPDATE_NOTIFICATION_LAST_SHOWN: "updateNotificationLastShown",
    /** Key for storing speech-to-translate active state in local storage */
    SPEECH_TO_TRANSLATE_IS_ACTIVE: "speechToTranslateIsActive",
    /** Key for storing the tab ID of the subtitle display page in local storage */
    SPEECH_TO_TRANSLATE_TAB_ID: "speechToTranslateTabId",
    /** Key for storing the subtitle display font size in local storage */
    SUBTITLE_FONT_SIZE: "subtitleFontSize",
    /** Key for storing the subtitle display font color in local storage */
    SUBTITLE_FONT_COLOR: "subtitleFontColor",
    /** Key for storing the subtitle display background color in local storage */
    SUBTITLE_BG_COLOR: "subtitleBgColor",
    /** Key for storing selection translator active state in local storage */
    SELECTION_TRANSLATOR_IS_ACTIVE: "selectionTranslatorIsActive",
  },
  SPEECH_TO_TRANSLATE_CONFIG: {
    /** Source language for speech recognition — always Spanish */
    SOURCE_LANGUAGE: "es",
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
    CHECK_EXT_UPLOAD: "CHECK_EXT_UPLOAD",
    SELECTION_MESSAGE: "SELECTION_MESSAGE",
  },
  APP_INFORMATION: {
    APP_NAME: "Redna Models",
    APP_NAME_SHORT: "Redna",
    APP_DIVISION: "Models",
    APP_PROVIDER: "Estrellas Webcam",
  },
  ESTRELLAS_WEB_BASEURL: {
    PRODUCTION: "https://www.estrellaswebcam.com",
    DEV: "http://localhost:4321",
  },
} as const;

Object.freeze(GLOBAL_STRINGS);
