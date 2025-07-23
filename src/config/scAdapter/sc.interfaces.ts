/**
 * Type definitions for StripChat DOM elements and configuration.
 * This module defines the interfaces and types used by the StripChat adapter.
 *
 * @module Config/ScInterfaces
 */

/**
 * Type representing StripChat DOM class names.
 */
export type ScClasses =
  | "main-layout-main-content"
  | "BroadcastContainer__main#ka"
  | "broadcast-player-wrapper view-cam-resizer view-cam-resizer-boundary-x view-cam-resizer-broadcast"
  | "BroadcastContainer__members#Go"
  | "player-panel-status-connection"
  | "BroadcastContainer__aside#AX"
  | "messages";

/**
 * Type representing StripChat DOM element IDs.
 */
export type ScIds = "external-switcher";

/**
 * Interface representing the configuration for StripChat DOM elements.
 */
export interface ScStrings {
  SC_CLASSES: ScClasses[];
  SC_IDS: ScIds[];
  ERROR_CONTAINER: {
    CLASS: ScClasses;
    FIND_BY: string;
  };
  BROADCAST_CONTAINER: {
    CLASS: ScClasses;
  };
  BROADCAST_WRAPPER: {
    CLASS: ScClasses;
  };
  BROADCAST_SWITCH: {
    ID: ScIds;
  };
  MEMBER_LIST: {
    CLASS: ScClasses;
  };
  STREAMING_STATUS: {
    CLASS: ScClasses;
  };
  CHAT_CONTAINER: {
    CLASS: ScClasses;
  };
}
