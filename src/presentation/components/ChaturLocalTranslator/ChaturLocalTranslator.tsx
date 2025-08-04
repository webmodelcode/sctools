import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { scAdapter } from "~@/config/scAdapter/sc.adapter";
import { TranslatedMessage } from "../TranslatedMessage/TranslatedMessage";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";
import { chaturAdapter } from "~@/config/chaturAdapter/chaturAdapter";

export const ChaturLocalTranslator = () => {
  const chatRef = useRef(chaturAdapter.getPublicChatTab());
  const messengerContainer = useRef(chaturAdapter.getTabsContainer());
  const { getItem, watchItem } = useQuickMenuIsActive();
  const [isExtActive, setIsExtActive] = useState(false);

  watchItem((value) => {
    setIsExtActive(value);
  });

  useEffect(() => {
    (async () => {
      setIsExtActive(await getItem());
    })();
  }, [getItem]);

  useMutationObserver({
    ref: messengerContainer,
    callback: (mutations) => {
      mutations.forEach((mutation) => {
        if (!(mutation.target as Element).classList?.contains("msg-list-fvm"))
          return;

        if (mutation.type === "childList" && isExtActive) {
          const firstNode = mutation.addedNodes[0];
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
                  root.render(
                    <TranslatedMessage
                      message={data}
                      bgColor="rgba(255, 0, 0, 0.1)"
                    />,
                  );
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
