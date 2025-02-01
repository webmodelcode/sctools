import { useCallback, useRef, useState } from "react";
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
  clearQuickMessages,
} from "@/services";
import type { QuickMessageType } from "@/services";
import { QuickMessage } from "../QuickMessage/QuickMessage";

interface QuickMessageOptionsProps {
  label: "add" | "update" | "delete";
  setNeedUpdateMessages: (value: boolean) => void;
}

export const QuickMessageOptions = ({
  label,
  setNeedUpdateMessages,
}: QuickMessageOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);
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
      if (exist) return;
      await addQuickMessage(quickMessage);
      setNeedUpdateMessages(true);
    };

    const handleUpdateMessage = async () => {
      const quickMessage = getNewMessage();
      if (!quickMessage) return;
      const indexToUpdate = await existQuickMessage(quickMessage.label);
      await updateQuickMessage(indexToUpdate, quickMessage);
      setNeedUpdateMessages(true);
    };

    const handleDeleteMessage = async () => {
      const label = titleRef.current?.value ?? "";
      if (!label) return;
      const indexToDelete = await existQuickMessage(label);
      await deleteQuickMessage(indexToDelete);
      setNeedUpdateMessages(true);
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

    setIsOpen(false);
  }, [label, setNeedUpdateMessages]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="sct-px-2 sct-m-1 sct-capitalize">
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="sct-capitalize">
            {label} Quick Message
          </DialogTitle>
          <DialogDescription>
            <span className="sct-capitalize">{label}</span> a quick message
            here. Click save when you're done.
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
          <Button onClick={onClick}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
