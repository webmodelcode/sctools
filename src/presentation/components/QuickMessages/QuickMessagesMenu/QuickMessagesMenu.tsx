/**
 * QuickMessagesMenu Component
 *
 * Creates a menu for using the QuickMessages feature. This component displays
 * a floating menu with quick message options when the user is focused on an editable element.
 *
 * @returns {JSX.Element} The rendered QuickMessagesMenu component or null if conditions aren't met
 * @module components/QuickMessage/QuickMessagesMenu
 */

import { useEffect, useState, useCallback, useMemo } from "react";

import { GLOBAL_STRINGS } from "~@/config/utils/globalStrings";
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
  const { getItem, watchItem } = useQuickMenuIsActive();
  const [extIsActive, setExtIsActive] = useState(false);
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessages, setQuickMessages] = useState<IQuickMessage[]>([]);

  const memoizedQuickMessages = useMemo(() => {
    return quickMessages.map((qm) => (
      <QuickMessage
        label={qm.label}
        text={qm.text}
        key={`${qm.label}${qm.text}`}
      />
    ));
  }, [quickMessages]);

  const reloadMessages = useCallback(async () => {
    const messages = await getQuickMessages();
    setQuickMessages(messages);
  }, []);

  const eventHandler = useCallback((e: Event) => {
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
  }, []);

  watchItem((value) => {
    setExtIsActive(value);
  });

  useEffect(() => {
    const checkExtIsActive = async () => {
      setExtIsActive(await getItem());
    };
    checkExtIsActive();
  }, [getItem]);

  useEffect(() => {
    reloadMessages();
  }, [reloadMessages]);

  useEffect(() => {
    document.addEventListener("selectionchange", eventHandler, true);
    return () => {
      document.removeEventListener("selectionchange", eventHandler, true);
    };
  }, [eventHandler]);

  if (!isOpen || !extIsActive) return null;

  return (
    <div
      className={
        "sct-component fixed right-0 bottom-0 z-40 min-w-12 rounded-t-2xl border border-ew-star-color bg-background/70 pt-2 text-foreground"
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
            className="w-12 animate-bounce flex-col-reverse items-center justify-around py-[0.25rem]"
          >
            <BotMessageSquare size={15} />
          </AccordionTrigger>
          <AccordionContent className="flex flex-col">
            {quickMessages.length <= 0 ? (
              <span className="w-20 p-2 text-center">
                {GLOBAL_STRINGS.ERROR_MESSAGES.QM_NOT_MESSAGES}
              </span>
            ) : (
              memoizedQuickMessages
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
