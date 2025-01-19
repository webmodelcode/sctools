import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

export const ContentMenu = () => {
  return (
    <div className="sct-max-w-20 sct-min-w-20 sct-fixed sct-bottom-0 sct-left-10">
      <Accordion type="single" collapsible role="accordion">
        <AccordionItem value="item-1">
          <AccordionTrigger className="sct-justify-around" />
          <AccordionContent>Accordion Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
