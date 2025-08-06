/**
 * QuickMessageOptions Component
 *
 * A dialog component that provides CRUD operations for quick messages.
 * Supports adding, updating, and deleting quick messages with proper validation.
 *
 * @param {QuickMessageOptionsProps} props - Component props
 * @returns {JSX.Element} Dialog component with form inputs and action buttons
 * @module components/QuickMessage/QuickMessageOptions
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "~@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~@/presentation/components/ui/dialog";
import { Input } from "~@/presentation/components/ui/input";
import { Label } from "~@/presentation/components/ui/label";
import { FloatAlert } from "../../FloatAlert/FloatAlert";

// Import separated modules
import { QuickMessageOptionsProps, ErrorMessage } from "./types";
import {
  handleAddMessage,
  handleUpdateMessage,
  handleDeleteMessage,
} from "./handlers";
import {
  getActionIcon,
  getDialogTitle,
  getDialogDescription,
  shouldShowMessageInput,
} from "./components";

import { QUICK_MESSAGE_OPTIONS } from "./quickMessageOptions.strings.json";

// Re-export types for external use
export type { QuickMessageOptionsProps } from "./types";

export const QuickMessageOptions = ({ label }: QuickMessageOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>({
    message: "",
    title: "",
  });
  const titleRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  /**
   * Clear error messages when dialog opens/closes
   */
  useEffect(() => {
    setErrorMsg({
      message: "",
      title: "",
    });
  }, [isOpen]);

  /**
   * Create handler functions with proper dependencies
   */
  const onAddMessage = useCallback(() => {
    handleAddMessage(titleRef, messageRef, setErrorMsg, setIsOpen);
  }, []);

  const onUpdateMessage = useCallback(() => {
    handleUpdateMessage(titleRef, messageRef, setErrorMsg, setIsOpen);
  }, []);

  const onDeleteMessage = useCallback(() => {
    handleDeleteMessage(titleRef, setErrorMsg, setIsOpen);
  }, []);

  /**
   * Main click handler that delegates to appropriate action handler
   */
  const onClick = useCallback(() => {
    switch (label) {
      case "add":
        onAddMessage();
        break;
      case "update":
        onUpdateMessage();
        break;
      case "delete":
        onDeleteMessage();
        break;
      default:
        console.error(
          `${QUICK_MESSAGE_OPTIONS.LABEL_NOT_FOUND}${label}`,
          label,
        );
        break;
    }
  }, [label, onAddMessage, onUpdateMessage, onDeleteMessage]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="m-1 px-2 text-ew-star-color capitalize"
          aria-label={`${label} quick message`}
        >
          {getActionIcon(label)}
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[325px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle(label)}</DialogTitle>
          <DialogDescription>{getDialogDescription(label)}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {QUICK_MESSAGE_OPTIONS.FORM.TITLE}
            </Label>
            <Input
              id="title"
              placeholder="Quick Message Title"
              className="col-span-3"
              autoComplete="off"
              ref={titleRef}
            />
          </div>
          {shouldShowMessageInput(label) && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                {QUICK_MESSAGE_OPTIONS.FORM.MESSAGE}
              </Label>
              <Input
                id="message"
                placeholder="Write your quick message here"
                className="col-span-3"
                autoComplete="off"
                ref={messageRef}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          {errorMsg.message && (
            <FloatAlert
              title={errorMsg.title}
              message={errorMsg.message}
              destructive
            />
          )}
          <Button onClick={onClick}>{QUICK_MESSAGE_OPTIONS.FORM.BUTTON}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
