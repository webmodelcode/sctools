/**
 *
 * Create the menu for add, update or delete quickmessages
 * @param {QuickMessageOptionsProps}
 * @return {JSX.Element}
 * @module components/QuickMessage/QuickMessageOptions
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getQuickMessages,
  addQuickMessage,
  updateQuickMessage,
  deleteQuickMessage,
} from "@/services";
import { FloatAlert } from "@/components";
import type { QuickMessageType } from "@/services";
import { Delete, NotebookPen, Plus } from "lucide-react";

type LabelOptions = "add" | "update" | "delete";

export interface QuickMessageOptionsProps {
  label: LabelOptions;
  setNeedUpdateMessages?: (value: boolean) => void;
}

export const QuickMessageOptions = ({
  label,
  setNeedUpdateMessages = (value: boolean) => {
    if (!value) return;
    if (!chrome.tabs) {
      location.reload();
      return;
    }
    chrome.tabs.reload();
  },
}: QuickMessageOptionsProps) => {
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
    const getNewMessage = (): QuickMessageType | undefined => {
      const label = titleRef.current?.value ?? "";
      const text = messageRef.current?.value ?? "";
      if (!label || !text) {
        return;
      }
      const quickMessage: QuickMessageType = { label, text };

      return quickMessage;
    };

    const existQuickMessage = async (label: string): Promise<number> => {
      const quickmessages = await getQuickMessages();
      const indexOfLabel: number = quickmessages.findIndex(
        (qm) => qm.label === label
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
      setNeedUpdateMessages(true);
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
      setNeedUpdateMessages(true);
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
      setNeedUpdateMessages(true);
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
  }, [label, setNeedUpdateMessages]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="sct-px-2 sct-m-1 sct-capitalize sct-text-[#F9AE28]"
        >
          {returnActionIcon(label)}
        </Button>
      </DialogTrigger>
      <DialogContent className="!sct-max-w-[325px]">
        <DialogHeader>
          <DialogTitle className="sct-capitalize">
            {label} Quick Message
          </DialogTitle>
          <DialogDescription>
            <span className="sct-capitalize">{label}</span> a quick message
            here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="sct-grid sct-gap-4 py-4">
          <div className="sct-grid sct-grid-cols-4 sct-items-center sct-gap-4">
            <Label htmlFor="title" className="sct-text-right">
              Tittle
            </Label>
            <Input
              id="title"
              placeholder="Quick Message Title"
              className="sct-col-span-3"
              autoComplete="off"
              ref={titleRef}
            />
          </div>
          {label !== "delete" && (
            <div className="sct-grid sct-grid-cols-4 sct-items-center sct-gap-4">
              <Label htmlFor="message" className="sct-text-right">
                Message
              </Label>
              <Input
                id="message"
                placeholder="Write your quick message here"
                className="sct-col-span-3"
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
