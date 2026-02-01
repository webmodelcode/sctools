import { FloatDropDown } from "../FloatDropDown/FloatDropDown";
import { TranslatedMessage } from "../TranslatedMessage/TranslatedMessage";
import { ScrollArea } from "../ui/scroll-area";
import { useCamsodaMessages } from "./hooks/useCamsodaMessages";

export const CamsodaLocalTranslator = () => {
  const { messages } = useCamsodaMessages();

  return (
    <FloatDropDown
      direction="left"
      className="fixed right-0 bottom-1/3 z-9999 min-h-20 max-w-1/2 rounded-l-md border border-ew-star-color bg-gray-300 text-black"
    >
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
            <TranslatedMessage
              message={message.translation || ""}
              bgColor="rgba(255, 0, 0, 0.1)"
            />
          </div>
        ))}
      </ScrollArea>
    </FloatDropDown>
  );
};
