/**
 * Configuration for StripChat DOM elements.
 * This module defines the class names and IDs used to interact with the StripChat website.
 *
 * @module Config/ScStrings
 */

import { ScStrings } from "./sc.interfaces.ts";

/**
 * Constants for StripChat DOM elements.
 */
export const SC_STRINGS: ScStrings = {
  SC_CLASSES: [
    "BroadcastContainer__aside#AX",
    "BroadcastContainer__main#ka",
    "BroadcastContainer__members#Go",
    "main-layout-main-content",
    "broadcast-player-wrapper view-cam-resizer view-cam-resizer-boundary-x view-cam-resizer-broadcast",
    "player-panel-status-connection",
    "BroadcastContainer__aside#AX",
    "messages",
  ],
  SC_HIDDEN_CLASSES: ["messenger-chat__messages-wrapper"],
  SC_IDS: ["external-switcher"],
  BROADCAST_CONTAINER: {
    CLASS: "BroadcastContainer__main#ka",
  },
  ERROR_CONTAINER: {
    CLASS: "main-layout-main-content",
    FIND_BY: "loadableerrorboundary",
  },
  BROADCAST_WRAPPER: {
    CLASS:
      "broadcast-player-wrapper view-cam-resizer view-cam-resizer-boundary-x view-cam-resizer-broadcast",
  },
  BROADCAST_SWITCH: {
    ID: "external-switcher",
  },
  MEMBER_LIST: {
    CLASS: "BroadcastContainer__members#Go",
  },
  STREAMING_STATUS: {
    CLASS: "player-panel-status-connection",
  },
  CHAT_CONTAINER: {
    CLASS: "BroadcastContainer__aside#AX",
  },
};
