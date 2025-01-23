import { useCallback, useState } from "react";
import { Maximize2 } from "lucide-react";
import { MenuButton } from "../";
import { scAdapter, GLOBAL_STINGS } from "@/config/";
import { SC_STRINGS } from "@/config/scAdapter/sc.strings";

import "./MaximizeButton.styles.css";

interface ToggleFocusChatParams {
  scBroadcastContainer: Element | null;
  scBroadCastWrapper: Element | null;
  scBroadcastSwitch: Element | null;
  scMemberList: Element | null;
}

const enableMaximized = ({
  scBroadcastContainer,
  scBroadCastWrapper,
  scBroadcastSwitch,
  scMemberList,
}: ToggleFocusChatParams) => {
  scBroadcastContainer?.classList.add("sct-flex-reverse");
  scBroadCastWrapper?.classList.add("sct-dnone");
  scBroadcastSwitch?.classList.add("sct-dnone");
  scMemberList?.classList.add("sct-h-70");
};

const disableMaximized = ({
  scBroadcastContainer,
  scBroadCastWrapper,
  scBroadcastSwitch,
  scMemberList,
}: ToggleFocusChatParams) => {
  scBroadcastContainer?.classList.remove("sct-flex-reverse");
  scBroadCastWrapper?.classList.remove("sct-dnone");
  scBroadcastSwitch?.classList.remove("sct-dnone");
  scMemberList?.classList.remove("sct-h-70");
};

export const MaximizeButton = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const onClick = useCallback(() => {
    const { getScElementByClassName, getScElementById } = scAdapter;
    if (!scAdapter.isScElementsReady()) {
      window.alert(GLOBAL_STINGS.SC_ELEMENTS_NO_READY);
      return false;
    }

    const scBroadcastContainer = getScElementByClassName(
      SC_STRINGS.BROADCAST_CONTAINER.CLASS
    );
    const scBroadCastWrapper = getScElementByClassName(
      SC_STRINGS.BROADCAST_WRAPPER.CLASS
    );
    const scBroadcastSwitch = getScElementById(SC_STRINGS.BROADCAST_SWITCH.ID);
    const scMemberList = getScElementByClassName(SC_STRINGS.MEMBER_LIST.CLASS);

    //TODO: Implement Error Observer

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
