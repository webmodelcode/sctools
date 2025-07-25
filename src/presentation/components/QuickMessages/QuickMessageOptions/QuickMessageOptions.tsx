/**
 *
 * Create the menu for add, update or delete quickMessages
 * @param {QuickMessageOptionsProps}
 * @return {JSX.Element}
 * @module components/QuickMessage/QuickMessageOptions
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getQuickMessages,
  addQuickMessage,
  updateQuickMessage,
  deleteQuickMessage,
  IQuickMessage,
} from "~@/infrastructure/datasource/quickMessages.local.datasource";

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

import { Delete, NotebookPen, Plus } from "lucide-react";
import { FloatAlert } from "../../FloatAlert/FloatAlert";

type LabelOptions = "add" | "update" | "delete";

export interface QuickMessageOptionsProps {
  label: LabelOptions;
}

export const QuickMessageOptions = ({ label }: QuickMessageOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onErrorMsg, setOnErrorMsg] = useState<{
    message: string;
    title: string;
  }>({
    message: "",
    title: "",
  });
  const titleRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOnErrorMsg({
      message: "",
      title: "",
    });
  }, [isOpen]);

  const onClick = useCallback(() => {
    const getNewMessage = (): IQuickMessage | undefined => {
      const label = titleRef.current?.value ?? "";
      const text = messageRef.current?.value ?? "";
      if (!label || !text) {
        return;
      }
      const quickMessage: IQuickMessage = { label, text };

      return quickMessage;
    };

    const existQuickMessage = async (label: string): Promise<number> => {
      const quickMessages = await getQuickMessages();
      const indexOfLabel: number = quickMessages.findIndex(
        (qm) => qm.label === label,
      );
      return indexOfLabel;
    };

    const handleAddMessage = async () => {
      const quickMessage = getNewMessage();
      if (!quickMessage) return;
      const exist = (await existQuickMessage(quickMessage.label)) >= 0;
      const msg = {
        title: `${quickMessage.label} Already exist`,
        message: "Set a new or use Update option",
      };
      if (exist) return setOnErrorMsg(msg);
      await addQuickMessage(quickMessage);
      setIsOpen(false);
    };

    const handleUpdateMessage = async () => {
      const quickMessage = getNewMessage();
      if (!quickMessage) return;
      const msg = {
        title: `${quickMessage?.label} not exist`,
        message: "Set a new in the correct option",
      };
      const exist = (await existQuickMessage(quickMessage.label)) >= 0;
      if (!exist) return setOnErrorMsg(msg);
      const indexToUpdate = await existQuickMessage(quickMessage.label);
      await updateQuickMessage(indexToUpdate, quickMessage);
      setIsOpen(false);
    };

    const handleDeleteMessage = async () => {
      const label = titleRef.current?.value ?? "";
      const msg = {
        title: `${label} not exist`,
        message: "Check and try again",
      };
      if (!label) return setOnErrorMsg(msg);
      const indexToDelete = await existQuickMessage(label);
      await deleteQuickMessage(indexToDelete);
      setIsOpen(false);
    };

    switch (label) {
      case "add":
        handleAddMessage();
        break;
      case "update":
        handleUpdateMessage();
        break;
      case "delete":
        handleDeleteMessage();
        break;
      default:
        console.error("Invalid label for QuickMessageOptions");
        break;
    }
  }, [label]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="m-1 px-2 text-ew-star-color capitalize"
        >
          {returnActionIcon(label)}
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[325px]">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {label} Quick Message
          </DialogTitle>
          <DialogDescription>
            <span className="capitalize">{label}</span> a quick message here.
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tittle
            </Label>
            <Input
              id="title"
              placeholder="Quick Message Title"
              className="col-span-3"
              autoComplete="off"
              ref={titleRef}
            />
          </div>
          {label !== "delete" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
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
          {onErrorMsg.message && (
            <FloatAlert
              title={onErrorMsg.title}
              message={onErrorMsg.message}
              destructive
            />
          )}
          <Button onClick={onClick}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const returnActionIcon = (label: LabelOptions) => {
  if (label === "add") return <Plus />;
  if (label === "delete") return <Delete />;
  if (label === "update") return <NotebookPen />;
};
