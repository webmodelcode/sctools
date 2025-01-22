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
  onClick: () => void;
}

const variants = {
  active: "outline",
  noActive: "ghost",
};

export const MenuButton = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const { ButtonIcon, title, onClick } = props;
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
                setIsActive(!isActive);
                onClick();
              }}
            >
              {ButtonIcon}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sct-z-[10000]">
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
