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
import { ReactNode } from "react";

interface Props {
  label: string;
  buttonLabel: string | ReactNode;
  buttonHandler?: () => void;
  buttonClassName?: string;
  havePopUp?: boolean;
  dialogHeader?: string;
  dialogDescription?: string;
  dialogContent?: ReactNode;
}

export const TooltipButton = ({
  label,
  buttonLabel,
  buttonClassName,
  buttonHandler,
  havePopUp,
  dialogHeader,
  dialogDescription,
  dialogContent,
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonClassName,
          "rounded-md border hover:bg-accent-foreground",
        )}
        onClick={buttonHandler}
      >
        <Tooltip>
          <TooltipTrigger asChild>{buttonLabel}</TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
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
