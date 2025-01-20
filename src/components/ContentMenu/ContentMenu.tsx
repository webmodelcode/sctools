import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ContentMenu = () => {
  return (
    <div className="sct-max-w-20 sct-min-w-20 sct-fixed sct-bottom-0 sct-left-10 sct-bg-gray-300/70 sct-z-[9999] sct-text-black sct-rounded-t-md">
      <Accordion type="single" collapsible role="accordion">
        <AccordionItem value="item-1">
          <AccordionTrigger className="sct-justify-around sct-py-1.5 [&>svg]:sct-text-red" />
          <AccordionContent>Accordion Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
