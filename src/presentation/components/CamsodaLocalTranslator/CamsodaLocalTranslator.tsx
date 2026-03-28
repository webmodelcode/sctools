import { ArrowDown, BadgeInfo } from "lucide-react";
import { FloatDropDown } from "../FloatDropDown/FloatDropDown";
import { TranslatedMessage } from "../TranslatedMessage/TranslatedMessage";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useCamsodaMessages } from "./hooks/useCamsodaMessages";
import { useChatScroll } from "./hooks/useChatScroll";

export const CamsodaLocalTranslator = () => {
  const { messages } = useCamsodaMessages();

  const {
    scrollRef,
    showScrollBottomButton,
    scrollToBottom,
    handleScrollStateChange,
  } = useChatScroll(messages);

  return (
    <FloatDropDown
      direction="left"
      className="fixed right-0 bottom-1/3 z-9999 min-h-20 max-w-2/5 rounded-l-md border border-ew-star-color bg-background text-foreground"
    >
      <div className="relative">
        <div className="flex items-center justify-center gap-2 bg-ew-star-color/10 px-5 py-2 text-foreground">
          <BadgeInfo className="h-8 w-8" />
          <span className="text-xs">
            Esta ventana filtra bots y notificaciones para mostrar únicamente
            las conversaciones y su traducción al español.
          </span>
        </div>
        <ScrollArea
          ref={scrollRef}
          className="h-96"
          data-testid="camsoda-local-translator"
          onScrollStateChange={handleScrollStateChange}
        >
          {messages.map((message) => {
            return (
              <div key={message.id} className="border-b border-gray-200 p-2">
                <img
                  className="mx-2 inline h-4 w-4 rounded-full"
                  src={message.user.avatar}
                  alt={message.user.name}
                />
                <span
                  className="font-bold"
                  style={{ color: message.user.color }}
                >
                  {message.user.name}
                </span>
                <span className="px-2">|</span>
                <span>{message.message}</span>
                <TranslatedMessage message={message.translation || ""} />
              </div>
            );
          })}
          {!messages.length && (
            <div className="border-b border-gray-200 p-2">
              <span className="font-bold">
                No hay mensajes o el traductor esta apagado
              </span>
            </div>
          )}
        </ScrollArea>
        {showScrollBottomButton && (
          <Button
            size="icon"
            className="absolute right-4 bottom-4 h-8 w-8 animate-bounce cursor-pointer rounded-full shadow-md"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>
    </FloatDropDown>
  );
};
