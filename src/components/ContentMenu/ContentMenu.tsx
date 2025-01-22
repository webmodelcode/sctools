import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MenuButton } from "..";
import { Maximize2, HandCoins } from "lucide-react";
import { GLOBAL_STINGS } from "@/config";

export const ContentMenu = () => {
  return (
    <div className="sct-max-w-20 sct-min-w-14 sct-fixed sct-bottom-0 sct-left-10 sct-bg-gray-300/70 sct-z-[9999] sct-text-black sct-rounded-t-md">
      <Accordion type="single" collapsible role="accordion">
        <AccordionItem value="item-1">
          <AccordionTrigger className="sct-justify-around sct-py-1 [&>svg]:sct-text-red" />
          <AccordionContent className="sct-text-sm sct-text-gray-500">
            <MenuButton
              ButtonIcon={<Maximize2 />}
              title="Maximize"
              onClick={() => {
                console.log("Maximizado");
              }}
            />
            <MenuButton
              isToggle={false}
              ButtonIcon={<HandCoins />}
              title="Support The Project"
              onClick={() => {
                window.open(GLOBAL_STINGS.DONATION_URL, "_blank", "noopener");
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
