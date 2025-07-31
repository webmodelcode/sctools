import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { scAdapter } from "~@/config/scAdapter/sc.adapter";
import { TranslatedMessage } from "../TranslatedMessage/TranslatedMessage";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";

export const ScLocalTranslatorMessenger = () => {
  const messengerContainer = useRef(
    scAdapter.getScElementByClassName("messenger-chats"),
  );
  const { getItem, watchItem } = useQuickMenuIsActive();
  const [isExtActive, setIsExtActive] = useState(false);
  const [haveMessenger, setHaveMessenger] = useState(false);

  watchItem((value) => {
    setIsExtActive(value);
  });

  useEffect(() => {
    (async () => {
      setIsExtActive(await getItem());
    })();
  }, [getItem, haveMessenger]);

  useMutationObserver({
    ref: messengerContainer,
    callback: (mutations) => {
      mutations.forEach((mutation) => {
        const chatWrappers = Array.from(
          scAdapter.getScMultipleElementsByClassName(
            "messenger-chat__messages-wrapper",
          ),
        );

        const isValidChatWrapper =
          chatWrappers?.length > 0 &&
          chatWrappers.includes(mutation.target as Element);
        if (
          mutation.type === "childList" &&
          isValidChatWrapper &&
          isExtActive
        ) {
          const firstNode = mutation.addedNodes[0];
          const msgContainer = firstNode?.firstChild?.lastChild?.firstChild;
          if (msgContainer) {
            browser.runtime.sendMessage(
              {
                type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHAT_MESSAGE,
                data: msgContainer.textContent?.trim(),
              },
              (data: string) => {
                if (data) {
                  // Create the container for the React component
                  const translateContainer = document.createElement("div");
                  msgContainer?.parentElement?.appendChild(translateContainer);

                  // Render the React component in the container
                  const root = createRoot(translateContainer);
                  root.render(
                    <div style={{ marginBottom: "8px" }}>
                      <TranslatedMessage message={data} bgColor="#99a1af" />
                    </div>,
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
