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
      <DialogTrigger onClick={buttonHandler}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                buttonClassName,
                "rounded-md border !px-2 hover:bg-accent-foreground hover:text-white",
              )}
              variant={"ghost"}
            >
              {buttonLabel}
            </Button>
          </TooltipTrigger>
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
