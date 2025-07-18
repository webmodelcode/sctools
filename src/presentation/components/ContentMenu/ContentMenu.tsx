/**
 * ContentMenu Component
 *
 * The `ContentMenu` component renders a menu with options like maximize, status indicator, and donation support.
 * It uses local storage to determine if the extension is active and conditionally renders its content.
 *
 * @module components/ContentMenu
 * @returns {JSX.Element} - Returns the JSX element representing the content menu.
 */

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~@/presentation/components/ui/accordion";
import { StatusIndicator } from "../StatusIndicator/StatusIndicator";
import { MaximizeButton } from "../MaximizeButton/MaximizeButton";
import { SmCheckTerms } from "../SmCheckTerms/SmCheckTerms";
import { useQuickMenuIsActive } from "~@/presentation/hooks/useQuickMenuIsActive/useQuickMenuIsActive";

export const ContentMenu = () => {
  const { getItem } = useQuickMenuIsActive();
  const [isExtActive, setIsExtActive] = useState(false);

  useEffect(() => {
    (async () => {
      setIsExtActive(await getItem());
    })();
  }, [getItem]);

  if (!isExtActive) return null;

  return (
    <div className="fixed bottom-0 left-10 z-[9999] max-w-20 min-w-14 rounded-t-md border border-ew-star-color bg-gray-300/80 text-black">
      <Accordion
        type="single"
        collapsible
        role="accordion"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex-col-reverse items-center justify-center py-[0.25rem]">
            <StatusIndicator />
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-500">
            {location.hostname.includes("stripchat") && <MaximizeButton />}
            {location.hostname.includes("streamatemodels") && <SmCheckTerms />}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
