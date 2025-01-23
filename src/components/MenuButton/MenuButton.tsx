import { ReactElement, useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  ButtonIcon: ReactElement;
  title: string;
  onClick: () => boolean;
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
                "sct-rounded-none sct-w-full",
                isActive ? variants.active : variants.noActive
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
            className="sct-z-[10000]"
          >
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
