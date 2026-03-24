import { useState, useMemo, useRef, useEffect } from "react";
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { useFeaturesStatus } from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";
import { camsodaAdapter } from "~@/config/camsodaAdapter/camsodaAdapter";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import {
  ITranslatedMessage,
  parseCamsodaMessageNode,
} from "../utils/domParser";

export const useCamsodaMessages = () => {
  const [messages, setMessages] = useState<ITranslatedMessage[]>([]);
  const chatContainer = useMemo(() => camsodaAdapter.getPublicChatTab(), []);
  const messengerContainer = useRef(chatContainer);
  const { translator } = useFeaturesStatus();

  // Keep ref updated if chatContainer changes (though it's memoized with [])
  useEffect(() => {
    messengerContainer.current = chatContainer;
  }, [chatContainer]);

  useMutationObserver({
    ref: messengerContainer,
    callback: (mutations) => {
      const msgMutations = mutations.flatMap((mutation) => {
        if (mutation.type !== "childList" || !mutation.addedNodes.length)
          return [];

        const element = mutation.addedNodes[0];
        const parsedMessage = parseCamsodaMessageNode(element);

        return parsedMessage ? [parsedMessage] : [];
      });

      /**
       * Remove duplicates from the mutations
       */
      const msgMutationsUniqueById: ITranslatedMessage[] = [
        ...new Map(msgMutations.map((item) => [item.id, item])).values(),
      ];

      /**
       * Translate each unique mutation
       */
      msgMutationsUniqueById.forEach((mutation) => {
        if (translator.isEnabled) {
          const { message, user, id } = mutation;

          browser.runtime.sendMessage(
            {
              type: GLOBAL_STRINGS.BG_MESSAGE_TYPE.CHAT_MESSAGE,
              data: message,
            },
            (data: string) => {
              if (data) {
                setMessages((prev) => {
                  const messageAlreadyExists = prev.some(
                    (message) => message.id === id,
                  );

                  /**
                   * If the message already exists in messages state, return the previous state
                   * This needs to be validated, as Camsoda's behavior generates duplicate mutations with each new message.
                   */
                  if (messageAlreadyExists) {
                    return prev;
                  }

                  return [
                    ...prev,
                    {
                      id,
                      user: {
                        name: user.name,
                        avatar: user.avatar,
                        color: user.color,
                      },
                      message,
                      translation: data,
                    },
                  ];
                });
              }
            },
          );
        }
      });
    },
  });

  return { messages };
};
