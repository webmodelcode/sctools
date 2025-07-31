import { Button, ButtonVariant } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ReactNode } from "react";

interface Props {
  label: string;
  buttonLabel: string | ReactNode;
  buttonHandler: () => void;
  buttonClassName?: string;
  buttonVariant?: ButtonVariant;
}

export const TooltipButton = ({
  label,
  buttonLabel,
  buttonClassName,
  buttonVariant,
  buttonHandler,
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={buttonVariant}
          className={buttonClassName}
          onClick={buttonHandler}
        >
          {buttonLabel}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};
