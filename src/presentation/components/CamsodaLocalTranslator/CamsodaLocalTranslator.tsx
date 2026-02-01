import { useRef } from "react";
import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
import { useMutationObserver } from "~@/presentation/hooks/useMutationObserver/useMutationObserver";
import { useFeaturesStatus } from "~@/presentation/hooks/useFeaturesStatus/useFeaturesStatus";
import { camsodaAdapter } from "~@/config/camsodaAdapter/camsodaAdapter";
import { ScrollArea } from "../ui/scroll-area";

interface ITranslatedMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    color: string;
  };
  message: string;
  translation?: string;
}

export const CamsodaLocalTranslator = () => {
  const [messages, setMessages] = useState<ITranslatedMessage[]>([]);
  const chatContainer = useMemo(() => camsodaAdapter.getPublicChatTab(), []);
  const messengerContainer = useRef(chatContainer);
  const { translator } = useFeaturesStatus();

  useEffect(() => {}, [messages]);

  useMutationObserver({
    ref: messengerContainer,
    callback: (mutations) => {
      const msgMutations = mutations.flatMap((mutation) => {
        if (mutation.type !== "childList" || !mutation.addedNodes.length)
          return [];
        const element = mutation.addedNodes[0];
        const elementSpans = (element as Element).querySelectorAll("span");

        /**
         * The Div containing the messages always has 2 spans.
         * The first span contains the user's name and avatar
         * The second span contains the message
         */
        if (elementSpans.length !== 2) return [];
        const user = elementSpans[0].textContent?.trim();
        const message = elementSpans[1].textContent?.trim() ?? "";

        /**
         * Create id for the message by combining the user's name and the message
         * In the absence of a unique ID from Camsoda, this is the best that can be achieved with the available information.
         */
        const id = `${user?.replaceAll(" ", "-")}-${message?.replaceAll(" ", "-")}`;
        const data: ITranslatedMessage = {
          id,
          user: {
            name: user ?? "",
            avatar: elementSpans[0].querySelector("img")?.src ?? "",
            color: elementSpans[0].style.color,
          },
          message,
        };
        return data;
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
                      id: id ?? "",
                      user: {
                        name: user.name ?? "",
                        avatar: user.avatar ?? "",
                        color: user.color ?? "",
                      },
                      message: message ?? "",
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

  return (
    <div className="fixed right-0 bottom-16 z-100 w-lg bg-white">
      <ScrollArea className="h-96" data-testid="camsoda-local-translator">
        {messages.map((message) => (
          <div key={message.id} className="border-b border-gray-200 p-2">
            <img
              className="mx-2 inline h-4 w-4 rounded-full"
              src={message.user.avatar}
              alt={message.user.name}
            />
            <span className="font-bold" style={{ color: message.user.color }}>
              {message.user.name}
            </span>
            <span className="px-2">|</span>
            <span>{message.message}</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
