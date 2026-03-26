import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { TranslatedMessage } from "../TranslatedMessage/TranslatedMessage";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { useFeaturesStatus } from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";
import { camsodaAdapter } from "~@/config/camsodaAdapter/camsodaAdapter";

export const CamsodaLocalTranslatorMessenger = () => {
  const messengerContainer = useRef(camsodaAdapter.getMessengerContainer());
  const { translator } = useFeaturesStatus();

  useMutationObserver({
    ref: messengerContainer,
    callback: (mutations) => {
      mutations.forEach((mutation) => {
        const chatWrappers = Array.from(
          camsodaAdapter.getMessengerChatWrapper(),
        );

        const isValidChatWrapper =
          chatWrappers?.length > 0 &&
          chatWrappers.includes(mutation.target as Element);
        if (
          mutation.type === "childList" &&
          mutation.addedNodes.length > 0 &&
          isValidChatWrapper &&
          translator.isEnabled
        ) {
          const firstNode = mutation.addedNodes[0] as Element;
          const msgContainer = firstNode.querySelector(
            "div.message-text-module__content--SHFph",
          );
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
                  msgContainer.append(translateContainer);

                  // Render the React component in the container
                  const root = createRoot(translateContainer);
                  root.render(
                    <div style={{ marginBottom: "8px" }}>
                      <TranslatedMessage message={data} />
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
