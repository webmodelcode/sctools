/**
 *
 * Create the menu for use the QuickMessages Feature
 * @return {JSX.Element}
 * @module components/QuickMessage/QuickMessagesMenu
 */

import { useEffect, useState } from "react";

import { isEditableElement } from "~@/config/utils/isTextElement";
import { getQuickMessages } from "~@/infrastructure/datasource/quickMessages.local.datasource";
import type { IQuickMessage } from "~@/infrastructure/datasource/quickMessages.local.datasource";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~@/presentation/components/ui/accordion";
import { QuickMessage } from "../QuickMessage/QuickMessage";
import { BotMessageSquare } from "lucide-react";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";

export const QuickMessagesMenu = () => {
  const { getItem } = useQuickMenuIsActive();
  const [extIsActive, setExtIsActive] = useState(false);
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [needUpdateMessages, setNeedUpdateMessages] = useState(false);
  const [quickMessages, setQuickMessages] = useState<IQuickMessage[]>([]);

  useEffect(() => {
    const checkExtIsActive = async () => {
      setExtIsActive(await getItem());
    };
    const loadMessages = async () => {
      const messages = await getQuickMessages();
      setQuickMessages(messages);
      setNeedUpdateMessages(false);
    };
    loadMessages();
    checkExtIsActive();
  }, [needUpdateMessages, getItem]);

  useEffect(() => {
    const eventhandle = (e: Event) => {
      const currentElement: Element = document.activeElement ?? document.body;
      if (!isEditableElement(currentElement)) {
        const target = e.target as HTMLElement;
        const targetClassList = target?.classList?.toString();
        if (targetClassList?.includes("sct-") || target?.id?.includes("sct-"))
          return;
        setIsOpen(false);
        setValue("");
        return;
      }
      setIsOpen(true);
    };
    document.addEventListener("selectionchange", eventhandle, true);
    return () => {
      document.removeEventListener("selectionchange", eventhandle, true);
    };
  }, [isOpen]);

  const canShowComponent = isOpen && extIsActive;

  return (
    canShowComponent && (
      <div
        className={
          "sct-component fixed right-0 bottom-0 z-40 min-w-12 bg-background/70 text-foreground"
        }
      >
        <Accordion
          type="single"
          role="QuickMessagesMenu"
          className="m-1"
          value={value}
          onMouseEnter={() => {
            setValue("item-1");
          }}
          onMouseLeave={() => {
            setValue("");
          }}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger
              showArrowIcon={false}
              className="[&>svg]:text-red flex-col-reverse items-center justify-around py-[0.25rem]"
            >
              <BotMessageSquare size={15} />
            </AccordionTrigger>
            <AccordionContent className="flex flex-col">
              {quickMessages.length <= 0 ? (
                <span className="w-80 p-2">
                  No quick messages found. Add a new one in the extension Popup.
                </span>
              ) : (
                quickMessages.map((qm) => (
                  <QuickMessage
                    label={qm.label}
                    text={qm.text}
                    key={`${qm.label}${qm.text}`}
                  />
                ))
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  );
};
