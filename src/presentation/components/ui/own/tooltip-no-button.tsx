import { cn } from "~@/presentation/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { ButtonVariant, buttonVariants } from "../button";
import { ReactElement } from "react";

interface Props {
  triggerLabel: string;
  textContent: string;
  triggerIcon?: ReactElement;
  showType?: "button" | "icon";
  variant?: ButtonVariant;
  className?: string;
}

export const TooltipNoButton = ({
  triggerLabel,
  triggerIcon,
  textContent,
  showType = "button",
  variant,
  className,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            buttonVariants({ variant, className }),
            "cursor-pointer",
          )}
          aria-label={`${triggerLabel} quick message`}
        >
          {showType === "icon" ? (
            triggerIcon
          ) : (
            <div className="flex items-center">
              {triggerIcon && <span className="mr-1">{triggerIcon}</span>}
              {triggerLabel}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{textContent}</TooltipContent>
    </Tooltip>
  );
};
