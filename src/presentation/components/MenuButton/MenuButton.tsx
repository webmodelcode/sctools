/**
 * MenuButton Component
 *
 * The `MenuButton` component is a reusable button designed for use in menus.
 * It supports an optional toggle state and displays a tooltip on hover.
 *
 * @param {Props} props - The properties passed to the component see the interface.
 *
 * @module components/MenuButton
 * @returns {JSX.Element} - Returns the JSX element representing the menu button.
 */

import { ReactElement, useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "~@/presentation/lib/utils";

/** Props interface for MenuButton */
export interface Props {
  /** The icon to be displayed inside the */
  ButtonIcon: ReactElement;
  /** The text to be displayed in the tooltip. */
  title: string;
  /** The callback function to be executed when the */
  onClick: () => boolean;
  /** Whether the button should act as a toggle. */
  isToggle?: boolean;
}

const variants = {
  active: "outline",
  noActive: "ghost",
};

export const MenuButton = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const { ButtonIcon, title, onClick, isToggle = true } = props;
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              role="menuButton"
              className={cn(
                "w-full rounded-none",
                isActive ? variants.active : variants.noActive,
              )}
              variant={isActive ? "outline" : "ghost"}
              onClick={() => {
                const isOk = onClick();
                if (!isOk || !isToggle) {
                  setIsActive(false);
                  return;
                }
                setIsActive(!isActive);
              }}
            >
              {ButtonIcon}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            style={{
              zIndex: "10000",
              background: "#000",
              color: "#fff",
              padding: "4px",
              fontSize: "0.8rem",
            }}
            className="z-[10000]"
          >
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
