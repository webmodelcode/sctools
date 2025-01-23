import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks";
import { MaximizeButton, MenuButton, StatusIndicator } from "..";
import { GLOBAL_STINGS } from "@/config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HandCoins } from "lucide-react";

export const ContentMenu = () => {
  const [isExtActive, setIsExtActive] = useState(false);
  const { getItem } = useLocalStorage();

  useEffect(() => {
    (async () => {
      setIsExtActive(
        (await getItem(GLOBAL_STINGS.EXT_ISACTIVE_LOCAL_STORAGE_KEY)) === "true"
      );
    })();
  }, [getItem]);

  return (
    isExtActive && (
      <div className="sct-max-w-20 sct-min-w-14 sct-fixed sct-bottom-0 sct-left-10 sct-bg-gray-300/80 sct-z-[9999] sct-text-black sct-rounded-t-md">
        <Accordion type="single" collapsible role="accordion">
          <AccordionItem value="item-1">
            <AccordionTrigger className="sct-justify-around sct-flex-col-reverse sct-py-[0.25rem] [&>svg]:sct-text-red">
              <StatusIndicator />
            </AccordionTrigger>
            <AccordionContent className="sct-text-sm sct-text-gray-500">
              <MaximizeButton />
              <MenuButton
                isToggle={false}
                ButtonIcon={<HandCoins />}
                title="Support The Project"
                onClick={() => {
                  window.open(GLOBAL_STINGS.DONATION_URL, "_blank", "noopener");
                  return true;
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  );
};
