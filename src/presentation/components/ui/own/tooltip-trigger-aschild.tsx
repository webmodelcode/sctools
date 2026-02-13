import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { ReactElement } from "react";

interface Props {
  children: ReactElement;
  tooltipText?: string;
}

export const TooltipTriggerAsChild = ({ children, tooltipText }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {tooltipText && (
        <TooltipContent className="max-w-sm">{tooltipText}</TooltipContent>
      )}
    </Tooltip>
  );
};
