import { cn } from "~@/presentation/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { ButtonVariant, buttonVariants } from "../button";
import { ReactElement } from "react";

interface Props {
  triggerLabel: string | ReactElement;
  textContent: string;
  variant?: ButtonVariant;
  className?: string;
}

export const TooltipNoButton = ({
  triggerLabel,
  textContent,
  variant,
  className,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(buttonVariants({ variant, className }))}
          aria-label={`${triggerLabel} quick message`}
        >
          {triggerLabel}
        </div>
      </TooltipTrigger>
      <TooltipContent>{textContent}</TooltipContent>
    </Tooltip>
  );
};
