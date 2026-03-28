import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { TranslatedMessage } from "../TranslatedMessage/TranslatedMessage";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { useFeaturesStatus } from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";
import { chaturAdapter } from "~@/config/chaturAdapter/chaturAdapter";

const recentMessages = new Map<string, number>();

export const ChaturLocalTranslator = () => {
  const tabsContainer = useMemo(() => chaturAdapter.getTabsContainer(), []);
  const messengerContainer = useRef(tabsContainer);
  const { translator } = useFeaturesStatus();

  useMutationObserver({
    ref: messengerContainer,
    callback: (mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && translator.isEnabled) {
          if (!(mutation.target as Element).classList?.contains("msg-list-fvm"))
            return;
          const firstNode = mutation.addedNodes[0];
          if (firstNode?.firstChild?.lastChild) {
            const msgContainer = firstNode.firstChild;
            const msgText =
              firstNode?.firstChild.lastChild?.textContent?.trim();
            const now = Date.now();
            const lastSeen = recentMessages.get(msgText ?? "");
            if (lastSeen && now - lastSeen < 500) return;
            recentMessages.set(msgText ?? "", now);
            browser.runtime.sendMessage(
              {
                type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHAT_MESSAGE,
                data: msgText,
              },
              (data: string) => {
                if (data) {
                  // Create the container for the React component
                  const translateContainer = document.createElement("div");
                  msgContainer.appendChild(translateContainer);

                  if (
                    (msgContainer as Element).classList?.contains("roomNotice")
                  )
                    return;

                  // Render the React component in the container
                  const root = createRoot(translateContainer);
                  root.render(<TranslatedMessage message={data} />);
                }
              },
            );
          }
        }
      });
    },
  });

  return <div className="hidden" data-testid="chatur-local-translator"></div>;
};
