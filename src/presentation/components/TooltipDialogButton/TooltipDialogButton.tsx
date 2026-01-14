import { cn } from "~@/presentation/lib/utils";
import { Button, ButtonVariant } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ReactElement } from "react";
import { TooltipNoButton } from "../ui/own/tooltip-no-button";

interface Props {
  buttonLabel: string;
  buttonIcon?: ReactElement;
  buttonHandler?: () => void;
  buttonClassName?: string;
  havePopUp?: boolean;
  dialogHeader?: string;
  dialogDescription?: string;
  dialogContent?: ReactElement;
}

export const TooltipDialogButton = ({
  buttonLabel,
  buttonIcon,
  buttonClassName,
  buttonHandler,
  havePopUp,
  dialogHeader,
  dialogDescription,
  dialogContent,
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger onClick={buttonHandler}>
        <TooltipNoButton
          showType="icon"
          triggerLabel={buttonLabel}
          triggerIcon={buttonIcon}
          textContent={buttonLabel}
          variant={"outline"}
          className={cn(buttonClassName, "bg-ew-star-color")}
        />
      </DialogTrigger>
      {havePopUp && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogHeader}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          {dialogContent}
        </DialogContent>
      )}
    </Dialog>
  );
};
