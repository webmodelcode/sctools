import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getQuickMessages, QuickMessageType } from "@/services";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const tags = Array.from({ length: 5 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export const QuickMessagesOptionsArea = () => {
  const [quickMessages, setQuickMessages] = useState<QuickMessageType[]>([]);
  useEffect(() => {
    const loadMessages = async () => {
      const messages = await getQuickMessages();
      setQuickMessages(messages);
    };
    loadMessages();
  }, []);
  return (
    <ScrollArea className="sct-max-h-72 sct-w-11/12 sct-rounded-md sct-border">
      <div className="sct-p-4 sct-text-center">
        <div className="sct-flex sct-items-center sct-justify-between sct-mb-4">
          <Label className=" sct-text-sm sct-font-medium sct-leading-none">
            Quick Messages
          </Label>
          <Button variant={"ghost"}>
            <Plus />
          </Button>
        </div>
        <Separator className="sct-my-2" />
        <Separator className="sct-my-2" />
        {quickMessages.map((qm) => (
          <>
            <div
              key={qm.label}
              className="sct-text-sm sct-flex sct-items-center sct-h-5"
            >
              <span className="sct-inline-block">{qm.label}</span>
              <Separator orientation="vertical" className="sct-mx-2" />
              <span className="sct-inline-block">{qm.text}</span>
            </div>
            <Separator className="sct-my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
};
