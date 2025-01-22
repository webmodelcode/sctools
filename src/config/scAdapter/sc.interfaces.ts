export type ScClasses =
  | "main-layout-main-content"
  | "BroadcastContainer__main#ka"
  | "broadcast-player-wrapper view-cam-resizer view-cam-resizer-boundary-x view-cam-resizer-broadcast"
  | "BroadcastContainer__members#Go cam-members"
  | "player-panel-status-connection"
  | "BroadcastContainer__aside#AX";

export type ScIds = "external-switcher";

export interface ScStrings {
  SC_CLASSES: ScClasses[];
  SC_IDS: ScIds[];
  ERROR_CONTAINER: {
    CLASS: ScClasses;
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
