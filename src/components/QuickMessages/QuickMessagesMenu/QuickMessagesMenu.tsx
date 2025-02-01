import { useEffect, useMemo, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { QuickMessage } from "../QuickMessage/QuickMessage";

import { isEditableElement } from "@/config";
import { getQuickMessages } from "@/services";
import type { QuickMessageType } from "@/services";

import { BotMessageSquare } from "lucide-react";

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
      setNeedUpdateMessages(false);
    };
    loadMessages();
  }, [needUpdateMessages]);

  useEffect(() => {
    const eventhandle = (e: FocusEvent) => {
      const currentElement: Element = document.activeElement ?? document.body;
      if (!isEditableElement(currentElement)) {
        const target = e.target as HTMLElement;
        const targetClassList = target?.classList.toString();
        if (targetClassList?.includes("sct-") || target?.id.includes("sct-"))
          return;
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
    document.addEventListener("focus", eventhandle, true);
    return () => {
      document.removeEventListener("focus", eventhandle, true);
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
        className={"sct-fixed sct-z-40 sct-text-foreground"}
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
                    No quick messages found. Add a new one in the extension
                    Popup.
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
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    )
  );
};
