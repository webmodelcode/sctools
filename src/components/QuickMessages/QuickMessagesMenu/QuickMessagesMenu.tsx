import { useEffect, useMemo, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { isEditableElement } from "@/config";
import { cn } from "@/lib/utils";

export const QuickMessagesMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentElementPosition, setCurrentElementPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

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
      });
      setIsOpen(true);
    };
    document.addEventListener("selectionchange", eventhandle);
    return () => {
      document.removeEventListener("selectionchange", eventhandle);
    };
  }, [isOpen]);

  const getYPosition = useMemo(() => {
    const value =
      currentElementPosition.y - 160 >= 0
        ? currentElementPosition.y - 50
        : currentElementPosition.y + 50;
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
        <NavigationMenu role="QuickMessagesMenu">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    )
  );
};
