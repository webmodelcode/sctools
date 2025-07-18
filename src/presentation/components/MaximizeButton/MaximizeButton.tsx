/**
 * MaximizeButton Component
 *
 * The `MaximizeButton` component allows users to toggle between a maximized and normal view of the streaming interface.
 * It interacts with specific DOM elements to apply CSS classes that modify the layout.
 * @param {ToggleFocusChatParams} props - The properties passed to the component see the interface.
 *
 * @module components/MaximizeButton
 * @returns {JSX.Element} - Returns the JSX element representing the maximize button.
 */

import { useCallback, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";

import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { SC_STRINGS } from "~@/config/scAdapter/sc.strings";

import "./MaximizeButton.styles.css";
import { scAdapter } from "~@/config/scAdapter/sc.adapter";
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { MenuButton } from "../MenuButton/MenuButton";

/** Interface for Params of MaximizeButton Component */
export interface ToggleFocusChatParams {
  /** Striptchat Broadcast container element */
  scBroadcastContainer: Element | null;
  /** Striptchat Wrapper container element */
  scBroadCastWrapper: Element | null;
  /** Striptchat Wrapper switch button element */
  scBroadcastSwitch: Element | null;
  /** Striptchat Member list container element */
  scMemberList: Element | null;
}

const enableMaximized = ({
  scBroadcastContainer,
  scBroadCastWrapper,
  scBroadcastSwitch,
  scMemberList,
}: ToggleFocusChatParams) => {
  scBroadcastContainer?.classList.add("flex-reverse");
  scBroadcastContainer?.classList.add("h-70");
  scBroadCastWrapper?.classList.add("dnone");
  scBroadcastSwitch?.classList.add("dnone");
  scMemberList?.classList.add("h-70");
};

const disableMaximized = ({
  scBroadcastContainer,
  scBroadCastWrapper,
  scBroadcastSwitch,
  scMemberList,
}: ToggleFocusChatParams) => {
  scBroadcastContainer?.classList.remove("flex-reverse");
  scBroadcastContainer?.classList.remove("h-70");
  scBroadCastWrapper?.classList.remove("dnone");
  scBroadcastSwitch?.classList.remove("dnone");
  scMemberList?.classList.remove("h-70");
};

export const MaximizeButton = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const scErrorNode = useRef(
    scAdapter.getScElementByClassName(SC_STRINGS.ERROR_CONTAINER.CLASS),
  );
  const errorMutationCallback: MutationCallback = useCallback((mutations) => {
    mutations.forEach((mutation) => {
      console.log(mutation);
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          const isError = scAdapter.isScErrorNode(node);
          if (isError) location.reload();
        });
      }
    });
  }, []);
  useMutationObserver({
    ref: scErrorNode,
    callback: errorMutationCallback,
  });
  const onClick = useCallback(() => {
    const { getScElementByClassName, getScElementById } = scAdapter;

    if (!scAdapter.isScElementsReady()) {
      window.alert(GLOBAL_STRINGS.ERROR_MESSAGES.SC_ELEMENTS_NOT_READY);
      return false;
    }

    const scBroadcastContainer = getScElementByClassName(
      SC_STRINGS.BROADCAST_CONTAINER.CLASS,
    );
    const scBroadCastWrapper = getScElementByClassName(
      SC_STRINGS.BROADCAST_WRAPPER.CLASS,
    );
    const scBroadcastSwitch = getScElementById(SC_STRINGS.BROADCAST_SWITCH.ID);
    const scMemberList = getScElementByClassName(SC_STRINGS.MEMBER_LIST.CLASS);

    if (!isMaximized) {
      enableMaximized({
        scBroadcastContainer,
        scBroadCastWrapper,
        scBroadcastSwitch,
        scMemberList,
      });
      setIsMaximized(true);
      return true;
    }
    if (isMaximized) {
      disableMaximized({
        scBroadcastContainer,
        scBroadCastWrapper,
        scBroadcastSwitch,
        scMemberList,
      });
      setIsMaximized(false);
    }

    return true;
  }, [isMaximized, setIsMaximized]);
  return (
    <MenuButton ButtonIcon={<Maximize2 />} title="Maximize" onClick={onClick} />
  );
};
