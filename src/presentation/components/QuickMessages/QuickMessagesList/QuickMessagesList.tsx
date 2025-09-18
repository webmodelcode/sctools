import { useState, useEffect } from "react";
import {
  IQuickMessage,
  deleteQuickMessage,
  getQuickMessageIndex,
  getQuickMessages,
  watchQuickMessages,
} from "~@/infrastructure/datasource/quickMessages.local.datasource";
import { ScrollArea } from "../../ui/scroll-area";
import { SquarePen, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { QuickMessageOptions } from "../QuickMessageOptions/QuickMessageOptions";

export const QuickMessagesList = () => {
  const [quickMessages, setQuickMessages] = useState<IQuickMessage[]>([]);

  const loadQuickMessages = async () => {
    const messages = await getQuickMessages();
    setQuickMessages(messages);
  };

  useEffect(() => {
    loadQuickMessages();
    watchQuickMessages(setQuickMessages);
  }, []);

  if (!quickMessages.length) return;

  return (
    <ScrollArea className="h-56 w-full border py-1" type="always">
      {quickMessages.map((message) => (
        <div
          key={message.label}
          className="my-2 mr-6 ml-4 flex items-center justify-between rounded-sm bg-white/30 px-2 py-1 transition-transform duration-300 hover:scale-102"
        >
          <div className="flex w-2/3 flex-col items-start justify-between">
            <span>{message.label}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-56 overflow-hidden text-nowrap text-ellipsis text-gray-500">
                  {message.text}
                </span>
              </TooltipTrigger>
              <TooltipContent className="w-56">
                <span>{message.text}</span>
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            <QuickMessageOptions label={"update"} msgId={message.label} />
            <QuickMessageOptions label={"delete"} msgId={message.label} />
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
