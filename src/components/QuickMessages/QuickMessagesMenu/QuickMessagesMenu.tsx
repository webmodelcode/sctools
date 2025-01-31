import { useEffect, useMemo, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { QuickMessage } from "../QuickMessage/QuickMessage";
import { QuickMessageOptions } from "../QuickMessageOptions/QuickMessageOptions";
import { isEditableElement } from "@/config";
import { getQuickMessages } from "@/services";
import type { QuickMessageType } from "@/services";

import { MessageSquarePlus, BotMessageSquare } from "lucide-react";

const quickMessageOptions: ("add" | "update" | "delete")[] = [
  "add",
  "update",
  "delete",
];

export const QuickMessagesMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [needUpdateMessages, setNeedUpdateMessages] = useState(false);
  const [quickMessages, setQuickMessages] = useState<QuickMessageType[]>([]);
  const [currentElementPosition, setCurrentElementPosition] = useState<{
    x: number;
    y: number;
    elmHeight: number;
  }>({ x: 0, y: 0, elmHeight: 0 });

  useEffect(() => {
    const loadMessages = async () => {
      const messages = await getQuickMessages();
      setQuickMessages(messages);
    };
    loadMessages();
  }, [needUpdateMessages]);

  useEffect(() => {
    const eventhandle = (e: Event) => {
      console.log(e.type);
      const currentElement: Element = document.activeElement ?? document.body;
      if (!isEditableElement(currentElement)) {
        setIsOpen(false);
        return;
      }
      if (isOpen) return;
      const currentPosition = currentElement.getBoundingClientRect();
      setCurrentElementPosition({
        x: currentPosition.left,
        y: currentPosition.top,
        elmHeight:
          currentElement instanceof HTMLElement
            ? currentElement.offsetHeight
            : 0,
      });
      setIsOpen(true);
    };
    document.addEventListener("selectionchange", eventhandle, true);
    return () => {
      document.removeEventListener("selectionchange", eventhandle, true);
    };
  }, [isOpen]);

  const getYPosition = useMemo(() => {
    const value = currentElementPosition.y + currentElementPosition.elmHeight;
    return `${value}px`;
  }, [currentElementPosition]);

  return (
    isOpen && (
      <div
        style={{
          top: getYPosition,
          left: `${currentElementPosition.x}px`,
        }}
        className={"sct-fixed"}
      >
        <NavigationMenu
          role="QuickMessagesMenu"
          orientation="horizontal"
          className="sct-m-1"
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <BotMessageSquare />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="sct-flex sct-flex-row">
                {quickMessages.length <= 0 ? (
                  <span className="sct-p-2 sct-w-80">
                    No quick messages found. Add a new one.
                  </span>
                ) : (
                  quickMessages.map((qm) => (
                    <QuickMessage
                      label={qm.label}
                      text={qm.text}
                      key={`${qm.label}${qm.text}`}
                    />
                  ))
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <MessageSquarePlus />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="sct-flex sct-flex-row">
                {quickMessageOptions.map((opt) => (
                  <QuickMessageOptions
                    label={opt}
                    key={opt}
                    setNeedUpdateMessages={setNeedUpdateMessages}
                  />
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    )
  );
};
