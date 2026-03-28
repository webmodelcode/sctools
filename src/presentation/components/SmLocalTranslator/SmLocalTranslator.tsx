import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { TranslatedMessage } from "../TranslatedMessage/TranslatedMessage";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { useFeaturesStatus } from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";
import { smAdapter } from "~@/config/smAdapter/sm.adapter";

export const SmLocalTranslator = () => {
  const messengerContainer = useRef(smAdapter.getChatTab());
  const { translator } = useFeaturesStatus();

  useMutationObserver({
    ref: messengerContainer,
    callback: (mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && translator.isEnabled) {
          const firstNode = mutation.addedNodes[0];
          if (!(firstNode as HTMLElement).dataset.taLocator) return;
          if (firstNode?.firstChild?.lastChild) {
            const msgContainer = firstNode.firstChild;
            browser.runtime.sendMessage(
              {
                type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHAT_MESSAGE,
                data: firstNode?.firstChild.lastChild?.textContent?.trim(),
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

  return <div className="hidden"></div>;
};
