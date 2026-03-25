import { cn } from "~@/presentation/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface Props {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right" | "bottom" | "top";
}

const directionClasses = {
  top: "rotate-180",
  left: "rotate-90",
  right: "rotate-270",
  bottom: "rotate-0",
};

export const FloatDropDown = ({
  children,
  className,
  direction = "bottom",
}: Props) => {
  return (
    <Accordion
      type="single"
      collapsible
      role="accordion"
      defaultValue="item-1"
      className={cn("flex items-center justify-center", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger
          role="trigger"
          className={cn(
            "animate-bounce cursor-pointer flex-col-reverse items-center justify-center py-1 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-ew-star-color",
            directionClasses[direction],
          )}
        />
        <AccordionContent
          className="text-sm text-gray-500"
          role="dropdown-panel"
        >
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
