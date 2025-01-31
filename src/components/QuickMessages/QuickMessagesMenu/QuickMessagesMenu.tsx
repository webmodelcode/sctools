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

import { MessageSquarePlus } from "lucide-react";

const quickMessagesArray: { label: string; text: string }[] = [
  {
    label: "hello",
    text: "hello world.",
  },
  {
    label: "bye",
    text: "goodbye world.",
  },
  {
    label: "info",
    text: "information about the world.",
  },
  {
    label: "warning",
    text: "warning about the world.",
  },
];

export const QuickMessagesMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentElementPosition, setCurrentElementPosition] = useState<{
    x: number;
    y: number;
    elmHeight: number;
  }>({ x: 0, y: 0, elmHeight: 0 });

  useEffect(() => {
    const eventhandle = () => {
      const currentElement: Element = document.activeElement ?? document.body;
      if (!isEditableElement(currentElement)) {
        setIsOpen(false);
        return;
      }
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
    document.addEventListener("selectionchange", eventhandle);
    return () => {
      document.removeEventListener("selectionchange", eventhandle);
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
                <MessageSquarePlus />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="sct-flex sct-flex-row">
                {quickMessagesArray.map((qm) => (
                  <QuickMessage
                    label={qm.label}
                    text={qm.text}
                    key={`${qm.label}${qm.text}`}
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
